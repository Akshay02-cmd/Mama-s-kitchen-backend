# Services Layer Documentation

This directory contains the service layer for the Mama's Kitchen backend API. The service layer separates business logic from HTTP request/response handling, making the codebase more maintainable, testable, and reusable.

## Architecture

```
┌─────────────┐
│  Routes     │  ← HTTP routing
└──────┬──────┘
       │
┌──────▼──────┐
│ Controllers │  ← Request/Response handling
└──────┬──────┘
       │
┌──────▼──────┐
│  Services   │  ← Business logic
└──────┬──────┘
       │
┌──────▼──────┐
│   Models    │  ← Database operations
└─────────────┘
```

## Purpose

The service layer:
- **Separates concerns**: Business logic is isolated from HTTP handling
- **Improves testability**: Services can be tested independently
- **Enhances reusability**: Services can be used by multiple controllers
- **Centralizes logic**: Business rules are in one place
- **Improves maintainability**: Changes to business logic don't affect controllers

## Service Files

### auth.service.js
Handles user authentication operations:
- `registerUser(userData)` - Register new user
- `loginUser(credentials)` - Authenticate user
- `getUserById(userId)` - Get user by ID
- `getUserByEmail(email)` - Get user by email

### user.service.js
Handles user management operations:
- `getAllUsers()` - Get all users
- `getAllCustomers()` - Get all customers
- `getAllOwners()` - Get all owners
- `getUserStatistics()` - Get user statistics

### profile.service.js
Handles profile management for customers and owners:
- `createCustomerProfile(userId, profileData)` - Create customer profile
- `getCustomerProfile(userId)` - Get customer profile
- `updateCustomerProfile(userId, updateData)` - Update customer profile
- `createOwnerProfile(userId, profileData)` - Create owner profile
- `getOwnerProfile(userId)` - Get owner profile
- `updateOwnerProfile(userId, updateData)` - Update owner profile

### mess.service.js
Handles mess/catering service operations:
- `createMess(ownerId, messData)` - Create mess
- `getMessById(messId)` - Get mess by ID
- `getAllMesses(filters)` - Get all messes with filters
- `updateMess(messId, updateData)` - Update mess
- `deleteMess(messId)` - Delete mess
- `getMessesByOwnerId(ownerId)` - Get messes by owner
- `verifyMessOwnership(messId, ownerId)` - Verify ownership

### meal.service.js
Handles meal/menu operations:
- `createMeal(messId, mealData)` - Create meal
- `getMealById(mealId)` - Get meal by ID
- `getAllMeals(filters)` - Get all meals with filters
- `getMealsByMessId(messId)` - Get meals by mess ID
- `updateMeal(mealId, updateData)` - Update meal
- `deleteMeal(mealId)` - Delete meal
- `verifyMealOwnership(mealId, messId)` - Verify ownership
- `isMealAvailable(mealId)` - Check availability

### order.service.js
Handles order management:
- `createOrder(userId, orderData)` - Create order
- `getOrderById(orderId)` - Get order by ID
- `getAllOrders()` - Get all orders
- `getUserOrders(userId)` - Get user's orders
- `updateOrderStatus(orderId, updateData)` - Update order status
- `deleteOrder(orderId)` - Delete order
- `clearUserOrders(userId)` - Clear user's orders
- `getOrdersByStatus(status)` - Get orders by status
- `getOrdersWithinDateRange(startDate, endDate)` - Get orders by date range
- `getTotalSales()` - Get total sales
- `getMonthlySales()` - Get monthly sales
- `getTopSellingMeals(limit)` - Get top selling meals

### review.service.js
Handles review operations:
- `createReview(reviewData)` - Create review
- `getAllReviews(filters)` - Get all reviews
- `getReviewById(reviewId)` - Get review by ID
- `updateReview(reviewId, userId, updateData)` - Update review
- `deleteReview(reviewId, userId)` - Delete review
- `getReviewsByMessId(messId)` - Get reviews for mess
- `getMessAverageRating(messId)` - Get average rating for mess

### contact.service.js
Handles contact us operations:
- `createContact(contactData)` - Create contact entry
- `getAllContacts()` - Get all contacts
- `getContactById(contactId)` - Get contact by ID
- `getContactsGroupedByUser()` - Get contacts grouped by user
- `deleteContact(contactId)` - Delete contact
- `deleteAllContacts()` - Delete all contacts
- `getContactStatistics()` - Get contact statistics

## Usage Example

### In Controllers

```javascript
import { authService } from '../services/index.js';
import catchAsync from '../utils/catchAsync.js';

const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  
  res.cookie("token", token, { httpOnly: true });
  res.status(StatusCodes.CREATED).json({
    success: true,
    user,
  });
});
```

### Error Handling

Services throw custom errors that are caught by the error middleware:

```javascript
import { NotFoundError, BadRequestError } from '../errors/index.js';

export const getMessById = async (messId) => {
  const mess = await Mess.findById(messId);
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }
  return mess;
};
```

## Best Practices

1. **Keep services pure**: Services should not handle HTTP requests/responses
2. **Throw appropriate errors**: Use custom error classes from `errors/`
3. **Validate input**: Services should validate business rules
4. **Return data, not responses**: Services return data, controllers format responses
5. **Use async/await**: All service methods are async
6. **Document with JSDoc**: All methods have JSDoc comments
7. **Handle edge cases**: Check for null/undefined and throw appropriate errors

## Testing

Services can be tested independently:

```javascript
import { authService } from '../services/auth.service.js';

describe('Auth Service', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'CUSTOMER'
    };
    
    const result = await authService.registerUser(userData);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
  });
});
```

## Migration Notes

Controllers have been refactored to use services. The old direct model access pattern:

```javascript
// Old way (in controller)
const user = await User.create(req.body);
```

Has been replaced with:

```javascript
// New way (using service)
const { user, token } = await authService.registerUser(req.body);
```

This provides better separation of concerns and makes the code more maintainable.

## File Structure

```
services/
├── auth.service.js      # Authentication services
├── user.service.js       # User management services
├── profile.service.js    # Profile services
├── mess.service.js       # Mess services
├── meal.service.js       # Meal services
├── order.service.js      # Order services
├── review.service.js     # Review services
├── contact.service.js    # Contact services
├── index.js              # Central exports
└── README.md             # This file
```

## Future Enhancements

- Add caching layer for frequently accessed data
- Add transaction support for complex operations
- Add service-level logging
- Add service-level metrics
- Add service-level rate limiting
