# Backend Authentication

## Overview

The backend uses JWT authentication with two delivery mechanisms at the same time:

- an `httpOnly` cookie named `token`
- a bearer token in the `Authorization` header

This dual approach matches the current frontend implementation, which stores the token in `localStorage` for API calls while also allowing the backend to set a cookie on login and registration.

## Supported User Roles

Roles supported by the user model and public auth validators:

- `CUSTOMER`
- `OWNER`

Important implementation note:

- some route modules still reference `ADMIN` in authorization middleware
- the public `User` model and auth validators do not allow creating or logging in as `ADMIN`
- treat `ADMIN` as an internal or incomplete path, not part of the normal product flow

## Login and Registration Flow

### Register

Endpoint:

```text
POST /auth/register
```

Expected request body:

```json
{
  "role": "CUSTOMER",
  "name": "Rahul Sharma",
  "email": "rahul@customer.com",
  "password": "password123"
}
```

### Login

Endpoint:

```text
POST /auth/login
```

Expected request body:

```json
{
  "role": "OWNER",
  "email": "priya@owner.com",
  "password": "password123"
}
```

### Logout

Endpoint:

```text
POST /auth/logout
```

Logout clears the cookie by writing an expired `token` cookie.

## What the Backend Returns

Both register and login return:

- `success: true`
- a lightweight `user` object
- a JWT `token`

Current response shape:

```json
{
  "success": true,
  "user": {
    "id": "65f0c3...",
    "name": "Rahul Sharma",
    "email": "rahul@customer.com",
    "role": "CUSTOMER"
  },
  "token": "<jwt>"
}
```

The controller also writes the same token to the `token` cookie.

## Token Payload

JWT payload fields are created in `src/model/user.model.js`:

```json
{
  "userId": "65f0c3...",
  "name": "Rahul Sharma",
  "role": "CUSTOMER"
}
```

## Token Lifetime and Config

Relevant environment variables:

```env
JWT_SECRET=replace-with-a-strong-secret
JWT_ACCESS_EXPIRATION_MINUTES=10080
```

Current implementation notes:

- token expiration is generated as `${JWT_ACCESS_EXPIRATION_MINUTES}m`
- if `JWT_ACCESS_EXPIRATION_MINUTES=10080`, the token lasts 7 days
- if the variable is missing, the model defaults to 10080 minutes

## Auth Middleware Behavior

Auth middleware lives in `src/middleware/auth.middleware.js`.

Current extraction order:

1. read `req.cookies.token`
2. if no cookie token is present, read `Authorization: Bearer <token>`
3. verify with `process.env.JWT_SECRET`
4. attach `req.user`

Attached request user shape:

```json
{
  "userId": "65f0c3...",
  "name": "Rahul Sharma",
  "role": "CUSTOMER"
}
```

If no token is found or verification fails, the middleware throws `UnauthorizedError("Authentication invalid")`.

## Role Protection

Role checks are applied with `authorizeRoles(...)` after authentication middleware.

Common patterns in the codebase:

- `authorizeRoles("CUSTOMER")` for order creation and customer profile creation
- `authorizeRoles("OWNER")` for mess creation, meal creation, owner analytics, and order status updates
- `authorizeRoles("CUSTOMER", "OWNER")` for contact submission
- `authorizeRoles("ADMIN")` on some review, contact, and user-list routes

## Profile-Related Reality

Authentication only establishes identity and role. It does not mean the user has completed a profile.

Current backend profile routes:

- `GET /profile/customer`
- `POST /profile/customer`
- `PUT /profile/customer`
- `GET /profile/owner`
- `POST /profile/owner`
- `PUT /profile/owner`

Implementation quirk worth knowing:

- `GET /profile/customer` currently allows both `CUSTOMER` and `OWNER`
- `GET /profile/owner` currently allows both `CUSTOMER` and `OWNER`

That is broader than the intended product usage, so client code should continue treating these as role-specific profile endpoints.

## Cookie vs Bearer Usage

### Cookie path

Useful when the browser automatically includes credentials. The backend sets:

- cookie name: `token`
- `httpOnly: true`

### Bearer path

Useful for explicit API clients. Example:

```http
Authorization: Bearer <jwt>
```

The frontend currently uses both:

- axios sends `withCredentials: true`
- axios also adds the bearer token from `localStorage`

## Common Failure Cases

### Missing or invalid token

Response:

```json
{
  "success": false,
  "message": "Authentication invalid"
}
```

### Wrong role for a protected route

Response:

```json
{
  "success": false,
  "message": "Access denied"
}
```

### Invalid credentials

Typical login failure:

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Duplicate registration email

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## Integration Notes for Frontend Developers

- always send the `role` field on register and login because the Joi schema requires it
- keep `withCredentials: true` enabled for cookie support
- keep bearer-token injection enabled because the frontend relies on it today
- do not assume profile completion is handled by the backend auth layer
- do not build normal product flows around `ADMIN` routes unless the backend role model is expanded first