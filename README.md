# Mumas Kitchen Backend

Mumas Kitchen Backend is the REST API for a meal-ordering platform where customers can browse messes, view meals, place orders, and track order status, while owners can manage their mess and monitor business activity.

This service is built with Node.js, Express, MongoDB, and Mongoose. It exposes role-aware endpoints for authentication, profile management, mess management, meals, orders, reviews, contacts, and owner analytics.

## What This Project Does

The backend supports two main user roles:

- CUSTOMER: can register, log in, create a customer profile, browse messes and meals, place orders, and view order history.
- OWNER: can register, log in, complete an owner profile, create a mess, create meals, manage orders, and view owner dashboard data.

Current product scope:

- One owner is currently expected to operate one active mess in normal product flow.
- The codebase still supports multiple mess records per owner in some service layers, but the current seeded data and UI flow are documented for one-owner-one-mess usage.
- Meals support optional extras such as papad, pickle, raita, extra chutney, or add-ons.
- Orders support selected extras per ordered meal item.

## Current Feature Set

- JWT-based authentication with cookie and bearer-token support
- Role-based route protection for CUSTOMER and OWNER users
- Separate customer and owner profiles
- Mess CRUD operations
- Meal CRUD operations
- Meal extras support in schema and validation
- Order creation, status updates, and owner order visibility
- Owner dashboard statistics and owned-mess listing
- Reviews and contact-us endpoints
- Customer review create, edit, and delete support
- Authenticated contact-us submission for customers and owners
- Swagger UI API documentation
- Seed scripts for local demo data

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Web framework | Express |
| Database | MongoDB |
| ODM | Mongoose |
| Validation | Joi |
| Auth | JWT |
| Password hashing | bcryptjs |
| API docs | swagger-jsdoc + swagger-ui-express |

## Folder Structure

```text
src/
  app.js                     Express app setup and route mounting
  server.js                  Server bootstrap and DB connection
  config/                    Runtime config, swagger, logger, token settings
  controllers/               HTTP request handlers
  docs/                      Swagger schema definitions
  errors/                    Custom error classes
  middleware/                Auth, validation, not-found, and error middleware
  model/                     Mongoose schemas and models
  routes/                    Express route modules
  seed/                      Seed scripts for local development/demo data
  services/                  Business logic and database orchestration
  utils/                     Utility helpers such as catchAsync
  validators/                Joi request validation schemas
```

## Core Domain Models

### User

- Base authentication entity
- Stores role, name, email, and hashed password
- Roles used today: CUSTOMER, OWNER

### CustomerProfile

- Linked to a CUSTOMER user
- Stores address, phone, and profile completion state

### OwnerProfile

- Linked to an OWNER user
- Stores address, phone, and profile completion state

### Mess

- Linked to an owner
- Stores public business information such as name, area, address, phone, description, and active status

### Meal

- Linked to a mess
- Stores mealType, vegetarian flag, description, price, availability, and extras

Example extras shape:

```json
{
  "name": "Papad",
  "price": 15,
  "is_Available": true
}
```

### Order

- Linked to a customer user
- Stores order items, each with mealId, quantity, price, and selectedExtras
- Stores total amount, delivery data, payment metadata, and status

Example selected extras shape:

```json
{
  "extraId": "65f0c3...",
  "name": "Raita",
  "price": 25
}
```

## Request Flow

Typical backend request flow:

1. Route matches an endpoint in src/routes.
2. Middleware validates auth, role, and payload shape.
3. Controller reads request values and delegates business logic.
4. Service executes database operations.
5. Controller returns JSON response.
6. Global error middleware formats failures.

## Main API Groups

Base URL in local development:

```text
http://localhost:5000
```

Main route groups:

- /auth
- /profile
- /mess
- /menu
- /orders
- /owner
- /reviews
- /contacts
- /users

Interactive docs:

```text
http://localhost:5000/api-docs
```

## Important Implementation Notes

### Authentication

- Login and register return both user info and token.
- The server also writes the token into an httpOnly cookie.
- Auth middleware accepts either the cookie token or an Authorization bearer token.

### Contact Submission Behavior

The contact-us endpoint now accepts the same payload shape used by the frontend form:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@customer.com",
  "phone": "9876543210",
  "subject": "Need help with an order",
  "message": "I want to update my delivery details."
}
```

The backend attaches the authenticated user id automatically, so the frontend does not need to send `userID`.

### Review Flow

Customer-facing review flow currently works like this:

- frontend loads mess reviews via `GET /reviews?mess=<messId>`
- customer submits a review with `POST /reviews`
- customer can update or delete only their own review
- backend returns populated review objects so the UI can refresh without a full reload

### Meal Creation Route

Meal creation currently uses an unusual route shape:

```text
POST /menu/:mealid
```

The controller does not use mealid for creation. Frontend code currently sends a placeholder value such as create. This is documented because it is current behavior and important for newcomers to understand.

### One Owner, One Mess Current Usage

Although some owner services aggregate over multiple messes, the current application flow should be understood as:

- owner logs in
- owner sees owned mess list
- owner selects one mess
- owner manages that specific mess dashboard

Seed data is aligned to that flow and creates one owner with one mess.

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally or reachable via MongoDB Atlas

### Install

```bash
npm install
```

### Environment Variables

Create a .env file in the backend project root:

```env
NODE_ENV=development
PORT=5000
MONGODB_URL=mongodb://127.0.0.1:27017/mumas-kitchen
JWT_SECRET=replace-with-a-strong-secret
CORS_ORIGINS=http://localhost:5173,https://mama-s-kitchen-rho.vercel.app
JWT_ACCESS_EXPIRATION_MINUTES=10080
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
```

### Run the Server

```bash
npm start
```

### Seed Demo Data

```bash
npm run seed
```

Seed output creates:

- one customer account
- one owner account
- one mess
- meals with extras
- orders that include selectedExtras
- one review

## Demo Credentials

Created by the seed script:

- Customer: rahul@customer.com / password123
- Owner: priya@owner.com / password123

## Useful Scripts

```bash
npm start       # Run with nodemon
npm run dev     # Run with inspector enabled
npm run seed    # Seed database with demo data
npm run docs    # Reminder for Swagger docs URL
```

## Beginner Walkthrough

If you are new to the project, follow this order:

1. Read this README for the product and setup overview.
2. Open docs/README.md for documentation map.
3. Read docs/ARCHITECTURE.md to understand how code is organized.
4. Start the server and open /api-docs.
5. Run the seed script and test login as customer and owner.

## Related Documentation

- [docs/README.md](docs/README.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md)
- [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)
- [docs/DATABASE.md](docs/DATABASE.md)
- [docs/ERROR_HANDLING.md](docs/ERROR_HANDLING.md)
- [SWAGGER_DOCUMENTATION.md](SWAGGER_DOCUMENTATION.md)

## Status

This backend is in active development. The current codebase is functional for local development and for the current customer and owner frontend flows, but there are still areas that should be normalized later, especially route consistency, admin-role completion, and environment-driven production configuration.