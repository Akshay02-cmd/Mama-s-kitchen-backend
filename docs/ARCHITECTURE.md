# Backend Architecture

## Overview

The backend follows a practical layered architecture that keeps HTTP concerns, business logic, validation, and persistence separate enough to work on safely.

At a high level:

1. Express routes define public API shape.
2. Middleware enforces authentication, roles, and input validity.
3. Controllers translate request data into service calls.
4. Services implement business logic and database orchestration.
5. Mongoose models define persistence rules and relationships.

## High-Level Flow

```text
Client
  -> Express route
  -> middleware chain
  -> controller
  -> service
  -> Mongoose model
  -> MongoDB
```

## Directory Responsibilities

```text
src/
  app.js
    Creates the Express app, applies middleware, mounts routes, exposes Swagger UI.

  server.js
    Reads validated config, connects to MongoDB, starts the HTTP server.

  config/
    Central runtime settings, JWT config, Swagger config, logging helpers.

  routes/
    Route modules only. Each route delegates actual work to controllers.

  controllers/
    Thin HTTP layer. Reads params, body, user, and returns JSON responses.

  services/
    Business logic layer. This is where ownership checks, aggregations, and core computations belong.

  model/
    Mongoose schemas and database model definitions.

  validators/
    Joi request validators. Used before controllers are executed.

  middleware/
    Shared request pipeline logic such as auth, role checks, validation, 404 handling, and global errors.

  errors/
    Custom application errors that map expected business failures to HTTP status codes.

  seed/
    Development/demo data generation scripts.
```

## Request Lifecycle Example

Example: creating an order

1. Request hits /orders.
2. auth middleware validates the JWT.
3. authorizeRoles ensures the user is a CUSTOMER.
4. createOrderSchema validates payload structure.
5. order controller calls order service.
6. order service verifies meal availability, computes extras totals, and creates the order.
7. Controller returns the created order JSON.

## Main Architectural Patterns

### Route -> Controller -> Service

This is the most important pattern in the codebase.

- Routes should stay small.
- Controllers should stay thin.
- Services should own business rules.

This keeps changes localized. For example, if order pricing changes, you usually only need to touch the order service and possibly validators or models.

### Joi for boundary validation

Incoming payloads are validated before they reach business logic. This avoids repetitive defensive checks inside services for basic shape validation.

### Custom error classes

Instead of throwing generic Error for expected conditions, the backend uses domain-specific error classes such as:

- BadRequestError
- UnauthorizedError
- ForbiddenError
- NotFoundError

This keeps failure responses consistent.

## Authentication Architecture

The app supports two token delivery strategies:

- httpOnly cookie token
- Authorization: Bearer token

The auth middleware checks the cookie first, then bearer token header.

That design exists because the frontend stores a token in localStorage for API calls while the server also sets a cookie on login.

## Role Model

Current production roles used in the app:

- CUSTOMER
- OWNER

Role checks happen through authorizeRoles middleware.

## Domain Model Relationships

```text
User
  -> CustomerProfile
  -> OwnerProfile

OwnerProfile.userId -> User
CustomerProfile.userId -> User

Mess.ownerId -> User
Meal.messId -> Mess

Order.userId -> User
Order.orderItems[].mealId -> Meal
Order.orderItems[].selectedExtras[] -> embedded order-time snapshot

Review.user -> User
Review.mess -> Mess
```

## Extras and Order Pricing

The extras feature changes both meal and order architecture.

### In Meal

Meals now carry an embedded extras array. Each extra has:

- name
- price
- is_Available

### In Order

Orders do not only reference the meal. They also store selected extras per line item as an embedded snapshot. This is important because prices and availability may change later, but the order must preserve what the customer actually purchased.

### Pricing behavior

Order total is calculated as:

```text
sum((base meal price + sum(selected extras)) * quantity)
```

This logic lives in the order service.

## Owner Workflow Design

The codebase contains some multi-mess owner support in owner services, but current product usage is intentionally simpler:

- one owner signs in
- one owner generally operates one mess
- owner dashboard shows mess cards
- clicking a mess card opens that mess-specific dashboard route

This is the behavior the frontend and seed data are now aligned around.

## Current Technical Quirks

These are worth documenting because they affect real development work:

### Meal creation route shape

Meal creation is currently exposed as:

```text
POST /menu/:mealid
```

This is not a typical REST create route. The controller ignores the mealid param and derives ownership from auth and messId/body context. New contributors should know this before trying to integrate or refactor it.

### Profile route access

Profile GET routes allow both CUSTOMER and OWNER roles, but the intended use is role-specific profile retrieval from the frontend.

### Mixed owner capability vs current product usage

Some owner services aggregate all messes for an owner. The UI and seed data currently treat one owner as managing one mess. That difference should stay visible in documentation until the product fully embraces multi-mess management.

## Where to Make Changes

### Add a new API resource

1. Add Joi validator in validators/
2. Add service logic in services/
3. Add controller in controllers/
4. Add route module or route entries in routes/
5. Mount route in app.js if new module
6. Update Swagger docs and markdown docs

### Change pricing logic

1. Update service calculation
2. Confirm model fields still match
3. Update seed data if totals depend on sample values
4. Update API docs if payload changes

### Change auth behavior

1. Update auth middleware or auth controller
2. Verify frontend token handling still matches
3. Update authentication documentation

## Recommended Mental Model for New Developers

If you are debugging something, start with the layer that owns the behavior:

- wrong endpoint or HTTP method: routes
- wrong status code or response wrapper: controller
- wrong validation error: validator
- wrong calculations or ownership rule: service
- wrong stored data shape: model or seed script
- auth rejection: middleware

That mental model will save a lot of time in this codebase.