# Backend Database Model

## Overview

The backend uses MongoDB with Mongoose. The schema design is simple and product-focused:

- `User` stores authentication identity and role
- customer and owner profiles are separate collections
- `Mess` represents the business a customer browses
- `Meal` belongs to a mess and can include embedded extras
- `Order` stores order-time snapshots of selected extras
- `Review` links a customer to a mess rating

## Connection

MongoDB connection is created during server startup and during seed execution using the `MONGODB_URL` environment variable.

Example local value:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/mumas-kitchen
```

## Collections

### User

Model: `src/model/user.model.js`

Purpose:

- authentication identity
- role assignment
- JWT generation

Schema summary:

| Field | Type | Notes |
| --- | --- | --- |
| `role` | `String` | enum: `CUSTOMER`, `OWNER` |
| `name` | `String` | required, trimmed, 3 to 30 chars |
| `email` | `String` | required, unique, lowercase, validated |
| `password` | `String` | hashed by pre-save hook |
| `createdAt` | `Date` | defaults to `Date.now` |

Implementation notes:

- password hashing uses `bcryptjs`
- JWT payload includes `userId`, `name`, and `role`
- public auth flow does not support creating an `ADMIN` user

### CustomerProfile

Model: `src/model/CustomerProfile.model.js`

Purpose:

- stores customer contact and completion state

Current documented shape in codebase usage:

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | `ObjectId` | ref to `User` |
| `phone` | `String` | required in normal flow |
| `address` | `String` | required in normal flow |
| `isProfileCompleted` | `Boolean` | used by frontend checks |
| `createdAt` | `Date` | timestamps |
| `updatedAt` | `Date` | timestamps |

### OwnerProfile

Model: `src/model/OwnerProfile.model.js`

Purpose:

- stores owner contact and completion state

Current documented shape in codebase usage:

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | `ObjectId` | ref to `User` |
| `phone` | `String` | required in normal flow |
| `address` | `String` | required in normal flow |
| `isProfileCompleted` | `Boolean` | used by frontend checks |
| `createdAt` | `Date` | timestamps |
| `updatedAt` | `Date` | timestamps |

### Mess

Model: `src/model/Mess.model.js`

Purpose:

- public business entity browsed by customers
- operational unit managed by owners

Common fields used across the app:

| Field | Type | Notes |
| --- | --- | --- |
| `ownerId` | `ObjectId` | ref to `User` |
| `name` | `String` | mess or kitchen name |
| `area` | `String` | area or locality |
| `phone` | `String` | contact number |
| `address` | `String` | business address |
| `description` | `String` | public description |
| `is_Active` | `Boolean` | active status |
| `createdAt` | `Date` | timestamps |
| `updatedAt` | `Date` | timestamps |

Product note:

- owner analytics can aggregate multiple messes
- seed data and current UI flow are aligned to one owner operating one selected mess at a time

### Meal

Model: `src/model/Meal.model.js`

Purpose:

- menu item attached to a mess

Schema summary:

| Field | Type | Notes |
| --- | --- | --- |
| `messId` | `ObjectId` | ref to `Mess` |
| `name` | `String` | required |
| `mealType` | `String` | enum: `breakfast`, `lunch`, `dinner`, `snack` |
| `is_Veg` | `Boolean` | required |
| `description` | `String` | required |
| `price` | `Number` | base price |
| `is_Available` | `Boolean` | defaults to true |
| `extras` | `Array` | embedded extra definitions |
| `createdAt` | `Date` | timestamps |
| `updatedAt` | `Date` | timestamps |

Embedded extra shape:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `String` | required |
| `price` | `Number` | required, min 0 |
| `is_Available` | `Boolean` | defaults to true |

Why extras are embedded here:

- extras are specific to a meal
- they are small and naturally belong with the meal definition

### Order

Model: `src/model/order.model.js`

Purpose:

- customer purchase record
- operational state for owner workflows

Top-level fields:

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | `ObjectId` | ref to `User` |
| `orderItems` | `Array` | embedded line items |
| `totalAmount` | `Number` | computed at order creation |
| `deliveryAddress` | `String` | required |
| `deliveryPhone` | `String` | required |
| `status` | `String` | enum: `PLACED`, `PREPARING`, `DELIVERED`, `CANCELLED` |
| `paymentMethod` | `String` | enum: `CREDIT_CARD`, `DEBIT_CARD`, `UPI`, `COD` |
| `paymentStatus` | `String` | enum: `PENDING`, `COMPLETED`, `FAILED` |
| `paymentId` | `String` | optional |
| `notes` | `String` | optional, max 500 |
| `deliveryTime` | `Date` | optional |
| `createdAt` | `Date` | timestamps |
| `updatedAt` | `Date` | timestamps |

Order item shape:

| Field | Type | Notes |
| --- | --- | --- |
| `mealId` | `ObjectId` | ref to `Meal` |
| `quantity` | `Number` | min 1 |
| `price` | `Number` | base meal price captured at order time |
| `selectedExtras` | `Array` | embedded extras snapshot |

Selected extra snapshot shape:

| Field | Type | Notes |
| --- | --- | --- |
| `extraId` | `ObjectId` | original meal extra id |
| `name` | `String` | copied into order |
| `price` | `Number` | copied into order |

This snapshot design matters because the order must preserve what the customer actually bought even if the source meal changes later.

Current total calculation used by the seed script and order service:

```text
sum((item.price + sum(selectedExtras.price)) * item.quantity)
```

### Review

Model: `src/model/review.model.js`

Purpose:

- customer rating and comment for a mess

Schema summary:

| Field | Type | Notes |
| --- | --- | --- |
| `user` | `ObjectId` | ref to `User` |
| `mess` | `ObjectId` | ref to `Mess` |
| `rating` | `Number` | 1 to 5 |
| `comment` | `String` | optional text |
| `createdAt` | `Date` | timestamps |
| `updatedAt` | `Date` | timestamps |

## Relationships

```text
User
  -> CustomerProfile
  -> OwnerProfile

User (OWNER)
  -> Mess

Mess
  -> Meal
  -> Review

User (CUSTOMER)
  -> Order
  -> Review

Order
  -> orderItems[].mealId
  -> orderItems[].selectedExtras[] snapshot
```

## Seed Data Assumptions

The seed script creates a small but important reference dataset:

- one customer user with completed customer profile
- one owner user with completed owner profile
- one active mess
- multiple meals with extras
- three orders that include selected extras
- one review

Seed credentials:

- customer: `rahul@customer.com / password123`
- owner: `priya@owner.com / password123`

## Design Observations

### Why profiles are separate from users

The app keeps user auth records small and role-neutral, while profile collections hold workflow-specific data.

### Why extras are duplicated into orders

Order history should not break or become inaccurate if a meal is renamed, repriced, or its extras list changes later.

### Why current documentation says one owner, one active mess

The backend can query all owner messes, but the current frontend and seed flow operate on one selected mess context. That is the most useful mental model for contributors today.