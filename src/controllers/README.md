# Controllers Module

Controllers handle the business logic for incoming HTTP requests and send appropriate responses.

## Architecture

Controllers follow the MVC (Model-View-Controller) pattern:
- **Model**: Data models defined in `src/model/`
- **View**: JSON responses sent to client
- **Controller**: Business logic (this directory)

## Files

### auth.controller.js
Handles user authentication operations.

**Functions:**
- `register(req, res)`: Create new user account
- `login(req, res)`: Authenticate existing user

**Features:**
- JWT token generation
- Password hashing validation
- Cookie-based authentication
- Error handling with try-catch

### profile.contorllers.js
Manages user profile operations for both customers and owners.

**Functions:**
- `CreateProfileCustomer`: Create customer profile
- `UpdateProfileCustomer`: Update customer profile
- `GetProfileCustomer`: Retrieve customer profile
- `CreateProfileOwner`: Create owner profile
- `UpdateProfileOwner`: Update owner profile
- `GetProfileOwner`: Retrieve owner profile

**Features:**
- User ID extraction from JWT
- Profile validation
- One profile per user constraint

### mess.controller.js
CRUD operations for mess/catering services.

**Functions:**
- `createMess`: Create new mess (Owner only)
- `getMess`: Get single mess by ID
- `updateMess`: Update mess details (Owner only)
- `deleteMess`: Delete mess (Owner only)
- `getallMesses`: Get all messes

**Features:**
- Owner authorization checks
- Async database operations
- Custom error handling

### meal.controller.js
Meal catalog management within messes.

**Functions:**
- `createMeal`: Add new meal to mess
- `getMeal`: Get single meal details
- `updateMeal`: Update meal information
- `deleteMeal`: Remove meal
- `getallMeals`: List all meals

**Features:**
- Mess association via messId
- Availability toggling
- Price management
- Meal type categorization

## Error Handling

All controllers use custom error classes:
- `BadRequestError`: Invalid input data
- `NotFoundError`: Resource not found
- `UnauthorizedError`: Authentication failure
- `ForbiddenError`: Insufficient permissions

## Response Format

### Success Response
```javascript
{
  success: true,
  user: { ... },
  profile: { ... },
  mess: { ... },
  meal: { ... }
}
```

### Error Response
Handled by try-catch blocks and custom error classes.

## Future Improvements

- [ ] Add async error wrapper middleware
- [ ] Implement pagination for list operations
- [ ] Add filtering and sorting
- [ ] Implement caching strategy
- [ ] Add request/response logging
- [ ] Optimize database queries
- [ ] Add transaction support for critical operations
