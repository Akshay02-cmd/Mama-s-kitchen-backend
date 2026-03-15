# Backend Error Handling

## Overview

The backend uses a straightforward Express error pipeline:

1. route middleware validates auth and payloads
2. controllers are wrapped with `catchAsync`
3. services throw typed application errors for expected failures
4. the global error middleware formats the final response

## Error Pipeline

```text
request
  -> auth / role / validation middleware
  -> controller wrapped by catchAsync
  -> service throws or returns
  -> error middleware
  -> HTTP response
```

## Custom Error Classes

Custom errors live in `src/errors`.

Current core classes:

- `BadRequestError`
- `UnauthorizedError`
- `ForbiddenError`
- `NotFoundError`
- `CutomeAPIError`

Implementation note:

- the base filename is currently spelled `CutomeAPIError.js`
- this is a typo in the codebase name, not a documentation typo

## Async Controller Handling

Controllers use `catchAsync` so rejected promises are forwarded to the global error handler instead of requiring repeated `try/catch` blocks.

Pattern:

```js
const register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});
```

## Validation Errors

Request body validation is handled by `src/middleware/validator.middelware.js` using Joi.

Current validation response shape:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "\"email\" is required",
    "\"password\" length must be at least 6 characters long"
  ]
}
```

Important note:

- `errors` is an array of message strings, not an array of `{ field, message }` objects

## Global Error Middleware

The final error formatter lives in `src/middleware/error.middelware.js`.

Current response shape:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "stack": "...only outside production..."
}
```

Behavior:

- uses `err.statusCode` when present
- falls back to HTTP 500 otherwise
- logs every error message
- logs stack traces for 500-level errors
- omits `stack` in production

## Common Error Sources

### Authentication failures

Usually thrown by auth middleware.

Typical message:

```json
{
  "success": false,
  "message": "Authentication invalid"
}
```

### Authorization failures

Usually thrown by `authorizeRoles(...)`.

Typical message:

```json
{
  "success": false,
  "message": "Access denied"
}
```

### Missing resources

Typical service-layer examples:

- order id not found
- meal id not found
- profile not found

Typical message pattern:

```json
{
  "success": false,
  "message": "Order with ID 65f0c3... not found"
}
```

### Business-rule failures

Examples:

- duplicate registration email
- unavailable meal during order creation
- invalid credentials

These usually surface as `BadRequestError` or `UnauthorizedError`.

## 404 Behavior

Unknown routes are handled by `src/middleware/notfound.middelware.js`.

Current 404 response is plain text, not JSON:

```text
Endpoint not found
```

This is worth remembering when debugging client-side error handling because 404s for missing routes do not match the normal JSON error shape.

## Frontend-Relevant Notes

The React frontend uses an axios response interceptor and already contains special handling for:

- `401` on profile endpoints
- generic `401` responses that should clear local auth state
- network failures with no server response

Because of that, backend changes to status codes or message shape can have immediate effects on login persistence and profile-completion flows.

## Practical Guidance for Contributors

### Throw a typed error when the failure is expected

Use a custom application error for cases like:

- not found
- bad request
- unauthorized access
- forbidden access

### Let `catchAsync` and middleware do the transport work

Do not manually duplicate response formatting inside every controller.

### Keep validation at the boundary

If a failure is about request shape, add or update Joi validation instead of pushing that concern deeper into services.

### Check 404 behavior before assuming JSON

If a client sees unexpected plain text, it may simply be hitting a route that is not mounted.