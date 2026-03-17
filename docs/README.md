# Backend Documentation

This folder contains the detailed backend documentation for Mumas Kitchen. It is intended to help three kinds of readers:

- newcomers who want to understand what the API does
- frontend developers integrating with the backend
- backend contributors extending or debugging the service

## Start Here

If this is your first time in the backend, read these files in this order:

1. [../README.md](../README.md)
2. [ARCHITECTURE.md](ARCHITECTURE.md)
3. [DATABASE.md](DATABASE.md)
4. [AUTHENTICATION.md](AUTHENTICATION.md)
5. [API_ENDPOINTS.md](API_ENDPOINTS.md)

## Documentation Map

### Architecture and internals

- [ARCHITECTURE.md](ARCHITECTURE.md)
  Explains the layered structure, how requests move through the app, and where to add new logic.

- [DATABASE.md](DATABASE.md)
  Describes collections, relationships, and the core data shapes used by the app.

### API usage

- [API_ENDPOINTS.md](API_ENDPOINTS.md)
  Lists route groups, sample payloads, and endpoint-level notes.

- [AUTHENTICATION.md](AUTHENTICATION.md)
  Explains JWT auth, cookies, bearer tokens, and role checks.

- [ERROR_HANDLING.md](ERROR_HANDLING.md)
  Covers the backend error model and how failures are returned.

### Interactive reference

- Swagger UI: http://localhost:5000/api-docs

## What Makes This Backend Different

These project-specific details matter for anyone integrating with the API:

- Both cookie-based auth and bearer-token auth are supported.
- Profiles are separate resources from users.
- Meals can contain extras.
- Orders can store selected extras per line item.
- Current product usage assumes one owner operating one mess, even though some service logic can aggregate multiple messes.
- Meal creation currently happens through POST /menu/:mealid with a placeholder parameter.

## Suggested Reading by Task

### I want to run the backend locally

- Read [../README.md](../README.md)

### I want to add a new endpoint

- Read [ARCHITECTURE.md](ARCHITECTURE.md)
- Read [API_ENDPOINTS.md](API_ENDPOINTS.md)
- Inspect the existing route, controller, service, and validator pattern

### I want to change auth behavior

- Read [AUTHENTICATION.md](AUTHENTICATION.md)
- Inspect src/middleware/auth.middleware.js and src/routes/auth.routes.js

### I want to understand why order totals include extras

- Read [DATABASE.md](DATABASE.md)
- Inspect src/model/order.model.js and src/services/order.service.js

## Quick Operational Notes

- Local default server URL: http://localhost:5000
- Swagger docs: http://localhost:5000/api-docs
- Seed command: npm run seed
- Start command: npm start

## Documentation Maintenance Rule

When you change one of the following, update documentation in the same task whenever possible:

- route contracts
- request or response shapes
- auth behavior
- schema fields
- seed data assumptions
- owner or customer workflow