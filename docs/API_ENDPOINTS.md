# Backend API Endpoints

## Overview

Base development URL:

```text
http://localhost:5000
```

Interactive Swagger UI:

```text
http://localhost:5000/api-docs
```

The route groups below are based on the actual Express route modules mounted in `src/app.js`.

## Response Conventions

This codebase does not use one strict envelope for every endpoint.

What is consistent:

- success responses usually include `success: true`
- error responses from the global error middleware include `success: false` and `message`
- validation middleware returns `success: false`, `message`, and an `errors` array

Validation error example:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "\"email\" is required"
  ]
}
```

## Authentication

Protected routes accept either:

- cookie auth via `token`
- bearer auth via `Authorization: Bearer <token>`

## Route Groups

### Auth

Mounted at `/auth`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Creates `CUSTOMER` or `OWNER` user, returns token and user |
| `POST` | `/auth/login` | Public | Logs user in, returns token and user |
| `POST` | `/auth/logout` | Public | Clears auth cookie |

### Profile

Mounted at `/profile`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/profile/customer` | Authenticated | Current middleware allows `CUSTOMER` and `OWNER` |
| `POST` | `/profile/customer` | `CUSTOMER` | Creates customer profile |
| `PUT` | `/profile/customer` | `CUSTOMER` | Updates customer profile |
| `GET` | `/profile/owner` | Authenticated | Current middleware allows `CUSTOMER` and `OWNER` |
| `POST` | `/profile/owner` | `OWNER` | Creates owner profile |
| `PUT` | `/profile/owner` | `OWNER` | Updates owner profile |

### Mess

Mounted at `/mess`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/mess` | Public | Returns mess list |
| `POST` | `/mess` | `OWNER` | Creates a mess |
| `GET` | `/mess/:id` | Public | Returns mess details |
| `PUT` | `/mess/:id` | `OWNER` | Updates a mess |
| `DELETE` | `/mess/:id` | `OWNER` | Deletes a mess |
| `GET` | `/mess/:messId/meals` | Public | Returns meals for a mess |
| `GET` | `/mess/:messId/orders` | `OWNER` | Returns owner-facing orders for a mess |
| `GET` | `/mess/:messId/stats` | `OWNER` | Returns owner-facing stats for a mess |

### Menu and Meals

Mounted at `/menu`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/menu` | Public | Returns all meals |
| `GET` | `/menu/:mealid` | Public | Returns a single meal |
| `POST` | `/menu/:mealid` | `OWNER` | Creates a meal |
| `PUT` | `/menu/:mealid` | `OWNER` | Updates a meal |
| `DELETE` | `/menu/:mealid` | `OWNER` | Deletes a meal |

Important implementation note:

- creation currently happens on `POST /menu/:mealid`
- this is not a typical REST create route
- frontend code currently works with that route shape and usually uses a placeholder segment such as `create`

### Orders

Mounted at `/orders`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/orders` | Authenticated | Returns all orders visible to current flow |
| `POST` | `/orders` | `CUSTOMER` | Creates a new order |
| `GET` | `/orders/:id` | Authenticated | Returns a single order |
| `PUT` | `/orders/:id` | `OWNER` | Updates order status |
| `DELETE` | `/orders/:id` | `OWNER` | Deletes an order |
| `GET` | `/orders/userorders` | Authenticated | Returns the current user's orders |
| `DELETE` | `/orders/userorders` | Authenticated | Deletes all current user's orders |
| `GET` | `/orders/status/:status` | `OWNER` | Filters orders by status |
| `GET` | `/orders/date-range` | `OWNER` | Filters orders by date range |
| `GET` | `/orders/total-sales` | `OWNER` | Aggregated total sales |

Order creation request shape used by the frontend:

```json
{
  "items": [
    {
      "mealId": "65f0c3...",
      "quantity": 2,
      "price": 180,
      "selectedExtras": [
        {
          "extraId": "65f0c4...",
          "name": "Papad",
          "price": 15
        }
      ]
    }
  ],
  "deliveryAddress": "Flat 301, MG Road",
  "deliveryPhone": "9876543210",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "notes": "Less spicy please",
  "status": "PLACED"
}
```

### Owner Analytics

Mounted at `/owner`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/owner/dashboard/stats` | `OWNER` | Summary metrics for owner dashboard |
| `GET` | `/owner/messes` | `OWNER` | Returns all messes owned by current owner |

This route group is one reason the backend still has some multi-mess support even though the current UI flow is centered on one selected mess at a time.

### Reviews

Mounted at `/reviews`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/reviews` | `ADMIN`, `OWNER`, `CUSTOMER` | List reviews |
| `POST` | `/reviews` | `CUSTOMER` | Create review |
| `GET` | `/reviews/:id` | `ADMIN`, `OWNER`, `CUSTOMER` | Read single review |
| `PUT` | `/reviews/:id` | `CUSTOMER` | Update review |
| `DELETE` | `/reviews/:id` | `CUSTOMER` | Delete review |

Current frontend usage:

- mess detail pages fetch reviews with `GET /reviews?mess=<messId>`
- customers can create a review from the mess detail page
- customers can edit and delete their own reviews from that same view

Create review request shape currently used by the frontend:

```json
{
  "user": "65f0c3...",
  "mess": "65f0d4...",
  "rating": 5,
  "comment": "Great food and timely delivery."
}
```

Important note:

- `ADMIN` appears in review route authorization
- public auth flow only supports `CUSTOMER` and `OWNER`

### Contact Us

Mounted at `/contacts`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/contacts` | `ADMIN` | List all contact entries |
| `POST` | `/contacts` | `CUSTOMER`, `OWNER` | Create contact or support request |
| `DELETE` | `/contacts` | `ADMIN` | Delete all contact entries |
| `GET` | `/contacts/groupbyuser` | `ADMIN` | Group contact records by user |
| `GET` | `/contacts/:id` | `ADMIN` | Get single contact entry |
| `DELETE` | `/contacts/:id` | `ADMIN` | Delete single contact entry |

Contact request shape currently used by the frontend:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@customer.com",
  "phone": "9876543210",
  "subject": "Need help with my order",
  "message": "Please call me back regarding order timing."
}
```

Important note:

- the backend derives `userID` from the authenticated request
- the frontend should not send `userID` directly

### Users

Mounted at `/users`

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| `GET` | `/users` | `ADMIN` | List users |
| `GET` | `/users/customers` | `ADMIN` | List customers |
| `GET` | `/users/owners` | `ADMIN` | List owners |

## Product-Specific Notes

### One owner, one active mess workflow

The current frontend and seed data assume:

1. an owner logs in
2. the owner sees owned mess cards
3. the owner selects one mess
4. operational pages then stay in that mess context

Even though some backend endpoints aggregate across all owner messes, the live product flow should still be documented as one selected mess at a time.

### Extras support

Meals contain embedded extras, and orders store selected extras as line-item snapshots.

This means an integration should:

- read extras from meal payloads
- send selected extras back during order creation
- not assume order totals are based on meal base price alone

### Route inconsistencies to know before integrating

- meal creation uses `POST /menu/:mealid`
- profile `GET` routes are currently broader than their intended role usage
- some admin-only routes exist without a normal admin auth flow in the public product

## Recommended Usage for New Contributors

1. Use Swagger for endpoint discovery and payload examples.
2. Use this file to understand route ownership and quirks.
3. Check the corresponding route module in `src/routes` when behavior looks surprising.