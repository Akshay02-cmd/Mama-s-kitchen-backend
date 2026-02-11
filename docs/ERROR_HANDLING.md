# Error Handling Documentation

## Overview
The application implements comprehensive error handling across both backend and frontend layers to ensure production-ready reliability and user-friendly error messages.

## Backend Error Handling

### Architecture

#### Custom Error Classes
Located in `/src/errors/`:
- **CutomeAPIError.js** (Note: filename has typo, should be "CustomAPIError")
  - Base error class
  - Extends native `Error` class
  - Includes `statusCode` property
  
- **BadRequestError.js** - HTTP 400
  - Used for invalid input, validation failures
  
- **UnauthorizedError.js** - HTTP 401
  - Used for authentication failures
  
- **ForbiddenError.js** - HTTP 403
  - Used for authorization failures (authenticated but not permitted)
  
- **NotFoundError.js** - HTTP 404
  - Used when requested resource doesn't exist

#### Async Error Handling Pattern
**File**: `/src/utils/catchAsync.js`

All controller functions are wrapped with the `catchAsync` utility:
```javascript
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
```

**Usage in Controllers**:
```javascript
export const createMeal = catchAsync(async (req, res) => {
  // Controller logic
  // Errors automatically caught and passed to error middleware
});
```

**Benefits**:
- No need for try-catch blocks in controllers
- Consistent error handling across all routes
- Errors automatically forwarded to global error handler

#### Global Error Middleware
**File**: `/src/middleware/error.middelware.js`

Handles all errors in one central location:
```javascript
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Log server errors (500+)
  if (statusCode >= 500) {
    console.error("Error stack:", err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
```

**Features**:
- Extracts statusCode and message from custom errors
- Logs stack traces for server errors (500+)
- Hides stack traces in production
- Returns consistent error response format

#### Validation Error Handling
**File**: `/src/middleware/validator.middelware.js`

Uses Joi schemas for request validation:
```javascript
const validator = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
};
```

**Error Response Format**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

#### 404 Not Found Handler
**File**: `/src/middleware/notfound.middelware.js`

Catches requests to non-existent routes:
```javascript
export const notfoundMiddleware = (req, res) => {
  res.status(404).send("Route does not exist");
};
```

**Note**: Could be improved to return JSON for consistency with API responses.

#### Middleware Registration Order
**File**: `/src/app.js`

Correct order is critical:
```javascript
// 1. Routes
app.use('/api/v1', routes);

// 2. 404 handler (catches unmatched routes)
app.use(notfoundMiddleware);

// 3. Global error handler (catches all errors)
app.use(errorHandler);
```

### Service Layer Error Handling

Services throw custom errors that are caught by `catchAsync`:

**Example from `/src/services/auth.service.js`**:
```javascript
if (!user) {
  throw new UnauthorizedError("Invalid credentials");
}

if (user.email !== email || user.password !== password) {
  throw new UnauthorizedError("Invalid credentials");
}
```

**Example from `/src/services/profile.service.js`**:
```javascript
if (!profile) {
  throw new NotFoundError("Customer profile not found");
}
```

### Error Scenarios Covered

✅ **Authentication Errors** (401)
- Invalid credentials
- Missing authentication token
- Expired or invalid JWT

✅ **Authorization Errors** (403)
- Insufficient permissions
- Access to resources owned by others

✅ **Validation Errors** (400)
- Missing required fields
- Invalid email format
- Password too short
- Invalid data types

✅ **Not Found Errors** (404)
- User not found
- Profile not found
- Order not found
- Mess not found
- Meal not found

✅ **Server Errors** (500+)
- Database connection failures
- Unhandled exceptions
- Third-party service failures

## Frontend Error Handling

### Architecture

#### Axios Interceptors
**File**: `/src/services/api/apiClient.js`

Centralized error handling for all API calls:

**Request Interceptor**:
```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Response Interceptor**:
```javascript
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Network error
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        isNetworkError: true
      });
    }

    const { status, data } = error.response;

    // Handle common HTTP errors
    switch (status) {
      case 401:
        // Clear authentication and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      
      case 403:
        // Forbidden - user doesn't have permission
        break;
      
      case 404:
        // Smart logging - don't log expected 404s
        if (!error.config?.url?.includes('/profile')) {
          console.error('Resource not found:', error.config?.url);
        }
        break;
      
      case 500:
      case 502:
      case 503:
        console.error('Server error:', data?.message);
        break;
    }

    // Return consistent error format
    return Promise.reject({
      status,
      message: data?.message || 'An error occurred',
      errors: data?.errors,
      data
    });
  }
);
```

**Features**:
- Automatic token attachment to requests
- Auto-clear auth on 401 (expired/invalid token)
- Auto-redirect to login on unauthorized
- Network error detection
- Smart logging (doesn't log expected 404s)
- Consistent error object returned to all service calls

#### React Error Boundary
**File**: `/src/components/shared/ErrorBoundary.jsx`

Catches React rendering errors:
```javascript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Note**: Includes TODO to integrate with error tracking service like Sentry in production.

#### Component-Level Error Handling

All pages implement error state management:

**Pattern**:
```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await someService.getData();
      setData(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

**UI States**:
1. **Loading State**: Shows spinner
2. **Error State**: Shows error message with retry option
3. **Empty State**: Shows "no data" message
4. **Success State**: Shows data

#### Page-Specific Error Handling

**Login/Signup Pages** (`/src/pages/shared/Login.jsx`, `/src/pages/shared/Signup.jsx`):
- Form validation errors
- API error handling with specific messages
- User-friendly error display
- Uses notification context to show errors

**Order Pages** (`/src/pages/customer/MyOrdersPage.jsx`, `/src/pages/customer/OrderDetailPage.jsx`):
- Loading states with spinners
- Error banners for failed requests
- Empty state for no orders
- Error-specific UI feedback

**Checkout Page** (`/src/pages/customer/CheckoutPage.jsx`):
- Payment processing errors
- Form validation
- Order creation failures
- Redirect validation (no cart = redirect)

**Owner/Mess Pages**:
- Dashboard data fetch errors
- Profile update/creation errors
- Order management errors
- Mess creation/update errors

### Notification System

**Context**: `/src/context/NotificationContext.jsx`

Provides toast notifications:
```javascript
const { showSuccess, showError, showInfo } = useNotification();

// Usage
showError('Failed to delete item');
showSuccess('Order placed successfully!');
```

Used in forms and critical operations for user feedback.

### Error Scenarios Covered

✅ **Network/Connection Errors**
- No internet connection
- API server down
- Request timeout

✅ **Authentication Errors**
- Invalid login credentials
- Token expiration (auto-logout + redirect)
- Unauthorized access

✅ **Form Validation Errors**
- Client-side validation before API call
- Server validation errors displayed
- Field-specific error messages

✅ **Data Fetch Errors**
- Failed to load orders
- Failed to load mess details
- Failed to load meals
- Profile not found

✅ **Operation Errors**
- Order creation failed
- Profile update failed
- Mess creation failed
- Meal creation failed
- Order status update failed

✅ **React Errors**
- Component rendering errors
- Caught by ErrorBoundary
- User can reload page

## Error Response Format Standards

### Backend API Responses

**Success Response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

### Frontend Error Object

After axios interceptor processing:
```javascript
{
  status: 400,
  message: "Error message from server",
  errors: [...],  // validation errors if present
  data: {...},    // full response data
  isNetworkError: true  // if network error
}
```

## Known Issues & Improvements

### Minor Issues

1. **Filename Typo**: `/src/errors/CutomeAPIError.js` should be `CustomAPIError.js`
   - Impact: None (exports correctly)
   - Fix: Rename file for consistency

2. **404 Middleware Returns Text**: Should return JSON for API consistency
   ```javascript
   // Current
   res.status(404).send("Route does not exist");
   
   // Should be
   res.status(404).json({
     success: false,
     message: "Route does not exist"
   });
   ```

3. **ErrorBoundary Missing Production Error Tracking**: TODO comment for Sentry integration
   - Impact: Can't track production errors effectively
   - Fix: Integrate Sentry or similar service

### Potential Improvements

1. **Error Logging Service**
   - Integrate Winston or Pino for structured logging
   - Send errors to centralized logging service

2. **Error Codes**
   - Add unique error codes for easier debugging
   - Example: `ERR_AUTH_001`, `ERR_VALIDATION_002`

3. **Rate Limiting Errors**
   - Add 429 (Too Many Requests) handling
   - Inform users when rate limited

4. **Offline Support**
   - Better offline error messaging
   - Queue requests when offline (service worker)

5. **Error Analytics**
   - Track error frequency
   - Monitor error trends
   - Alert on error spikes

## Testing Error Handling

### Manual Testing Checklist

Backend:
- [ ] Invalid login credentials → 401 with message
- [ ] Missing auth token → 401 redirect
- [ ] Invalid/expired JWT → 401 redirect  
- [ ] Access other user's resource → 403
- [ ] Invalid request body → 400 with validation errors
- [ ] Request non-existent resource → 404
- [ ] Database connection failure → 500

Frontend:
- [ ] Network disconnected → Network error message
- [ ] Token expired → Auto-logout + redirect to login
- [ ] Invalid form submission → Field errors displayed
- [ ] API returns error → Error banner shown
- [ ] Component throws error → ErrorBoundary catches
- [ ] Empty data set → Empty state displayed

## Conclusion

The application has **comprehensive, production-ready error handling** across all layers:

✅ Backend uses custom error classes with consistent error middleware
✅ All async controllers wrapped with catchAsync utility  
✅ Validation errors handled with detailed field-level messages
✅ Frontend has axios interceptors for centralized API error handling
✅ React ErrorBoundary catches rendering errors
✅ All pages have loading, error, and empty states
✅ User-friendly error messages displayed throughout
✅ Automatic authentication cleanup and redirect on 401

**Status**: ✅ **Production Ready** (with minor improvements recommended)
