# Error Handling Module

Custom error classes for consistent error handling across the application.

## Architecture

All custom errors extend the base `CustomAPIError` class, which itself extends the native JavaScript `Error` class.

## Files

### CutomeAPIError.js (Base Class)
The foundation for all custom errors.

**Properties:**
- `message`: Error description
- `statusCode`: HTTP status code

**Usage:**
```javascript
throw new CustomApiError("Custom message", 500);
```

### BadRequestError.js
For invalid client requests (400 Bad Request).

**Use Cases:**
- Invalid input data
- Missing required fields
- Data format errors
- Validation failures

**Example:**
```javascript
throw new BadRequestError("Unable to create mess");
```

### UnauthorizedError.js
For authentication failures (401 Unauthorized).

**Use Cases:**
- Missing authentication token
- Invalid JWT token
- Expired token
- Incorrect credentials

**Example:**
```javascript
throw new UnauthorizedError("Authentication invalid");
```

### ForbiddenError.js
For authorization failures (403 Forbidden).

**Use Cases:**
- User lacks required permissions
- Role-based access denial
- Resource ownership violation

**Example:**
```javascript
throw new ForbiddenError("Access denied");
```

### NotFoundError.js
For missing resources (404 Not Found).

**Use Cases:**
- Database record not found
- Invalid resource ID
- Deleted resources

**Example:**
```javascript
throw new NotFoundError("Meal not found");
```

### index.js
Central export file for all error classes.

**Usage:**
```javascript
import { BadRequestError, NotFoundError } from '../errors/index.js';
```

## Error Flow

```
1. Error thrown in controller
   ↓
2. Custom error class sets message and statusCode
   ↓
3. Express error handler catches error
   ↓
4. Response sent with appropriate status and message
```

## HTTP Status Codes Used

| Code | Error Class | Meaning |
|------|-------------|---------|
| 400 | BadRequestError | Invalid client request |
| 401 | UnauthorizedError | Authentication required |
| 403 | ForbiddenError | Insufficient permissions |
| 404 | NotFoundError | Resource not found |
| 500 | CustomAPIError | Generic server error |

## Best Practices

1. **Always throw specific errors**
   ```javascript
   // Good
   throw new NotFoundError("User not found");
   
   // Avoid
   throw new Error("User not found");
   ```

2. **Provide descriptive messages**
   ```javascript
   // Good
   throw new BadRequestError("Unable to create meal: invalid price");
   
   // Avoid
   throw new BadRequestError("Error");
   ```

3. **Use appropriate error types**
   - Use `NotFoundError` for missing database records
   - Use `BadRequestError` for validation failures
   - Use `UnauthorizedError` for auth failures
   - Use `ForbiddenError` for permission issues

## Future Enhancements

- [ ] Add global error handler middleware
- [ ] Implement error logging service
- [ ] Add stack trace in development mode
- [ ] Create error response formatter
- [ ] Add error monitoring (Sentry, etc.)
- [ ] Implement retry logic for transient errors
- [ ] Add custom error codes for client handling
