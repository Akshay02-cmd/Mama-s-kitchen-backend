# Middleware Module

Middleware functions that process requests before they reach route handlers.

## Overview

Middleware functions have access to the request object (`req`), response object (`res`), and the next middleware function (`next`).

## Files

### auth.middleware.js
Verifies user authentication via JWT tokens.

**Purpose:**
- Extract and verify JWT tokens
- Attach user data to request object
- Support both cookie and Bearer token authentication

**Features:**
- Dual authentication support (cookies + headers)
- JWT verification
- User payload extraction
- Error handling for invalid tokens

**Usage:**
```javascript
import auth from './middleware/auth.middleware.js';

router.get('/protected', auth, (req, res) => {
  // req.user contains: { userId, name, role }
});
```

**Request Object Addition:**
```javascript
req.user = {
  userId: "648a1b2c3d4e5f6g7h8i9j0k",
  name: "John Doe",
  role: "CUSTOMER"
}
```

### authorizeRoles.middelware.js
Restricts route access based on user roles.

**Purpose:**
- Enforce role-based access control (RBAC)
- Verify user has required role
- Block unauthorized role access

**Features:**
- Supports multiple role checks
- Works with auth middleware
- Throws ForbiddenError on failure

**Usage:**
```javascript
import authorizeRoles from './middleware/authorizeRoles.middelware.js';

// Single role
router.post('/mess', auth, authorizeRoles('OWNER'), createMess);

// Multiple roles (if needed)
router.get('/admin', auth, authorizeRoles('ADMIN', 'SUPER_ADMIN'), handler);
```

**Supported Roles:**
- `CUSTOMER`: Regular customers
- `OWNER`: Mess/catering owners

### validator.middelware.js
Validates request body against Joi schemas.

**Purpose:**
- Validate incoming request data
- Ensure data integrity
- Provide detailed validation errors

**Features:**
- Joi schema validation
- Comprehensive error messages
- Early validation failure
- Detailed error array

**Usage:**
```javascript
import validate from './middleware/validator.middelware.js';
import { RegisterSchema } from './validators/auth.validators.js';

router.post('/register', validate(RegisterSchema), register);
```

**Validation Response:**
```javascript
// On validation error
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "\"email\" must be a valid email",
    "\"password\" length must be at least 6 characters long"
  ]
}
```

## Middleware Chain Order

Correct order is crucial for security and functionality:

```javascript
router.post(
  '/mess',
  auth,                        // 1. Authenticate user
  authorizeRoles('OWNER'),     // 2. Check role
  validate(MessSchema),        // 3. Validate input
  createMess                   // 4. Execute controller
);
```

## Common Patterns

### Public Route
```javascript
router.get('/meals', getMeals);
```

### Authenticated Route
```javascript
router.get('/profile', auth, getProfile);
```

### Role-Protected Route
```javascript
router.post('/mess', auth, authorizeRoles('OWNER'), createMess);
```

### Fully Protected Route
```javascript
router.post(
  '/mess',
  auth,
  authorizeRoles('OWNER'),
  validate(MessSchema),
  createMess
);
```

## Error Handling

All middleware throws custom errors:
- `auth`: Throws `UnauthorizedError`
- `authorizeRoles`: Throws `ForbiddenError`
- `validate`: Returns 400 with error details

## Best Practices

1. **Always use `auth` before `authorizeRoles`**
   ```javascript
   // Correct
   router.post('/resource', auth, authorizeRoles('OWNER'), handler);
   
   // Wrong - authorizeRoles needs req.user from auth
   router.post('/resource', authorizeRoles('OWNER'), auth, handler);
   ```

2. **Validate after authentication**
   ```javascript
   // Correct - validate authenticated requests
   router.post('/mess', auth, validate(schema), handler);
   ```

3. **Use specific error messages**
   ```javascript
   // In middleware
   throw new UnauthorizedError("Authentication token missing");
   // Not just:
   throw new UnauthorizedError("Error");
   ```

## Future Enhancements

- [ ] Add request rate limiting
- [ ] Implement CORS middleware
- [ ] Add request logging middleware
- [ ] Create async error wrapper
- [ ] Add input sanitization
- [ ] Implement request/response compression
- [ ] Add API versioning middleware
- [ ] Create response formatting middleware
- [ ] Add file upload middleware (multer)
- [ ] Implement caching middleware
