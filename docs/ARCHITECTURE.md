# Backend Architecture

## Overview

Mama's Kitchen backend is built using a **layered architecture pattern** that separates concerns and promotes maintainability, scalability, and testability.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Client (Frontend/Mobile)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           API Layer (Routes)            │
│  - Authentication Routes                │
│  - Resource Routes                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Middleware Layer                  │
│  - Authentication Middleware            │
│  - Authorization Middleware             │
│  - Validation Middleware                │
│  - Error Handling Middleware            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Controller Layer                   │
│  - Request Handling                     │
│  - Response Formatting                  │
│  - Business Logic Delegation            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Service Layer                      │
│  - Business Logic                       │
│  - Data Processing                      │
│  - Transaction Management               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Model Layer (Data Access)          │
│  - Mongoose Models                      │
│  - Schema Definitions                   │
│  - Database Interactions                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Database (MongoDB)              │
└─────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app.js                    # Express app configuration
├── server.js                 # Server initialization
├── config/                   # Configuration files
│   ├── config.js            # Central configuration
│   ├── logger.js            # Winston logger setup
│   ├── morgan.js            # HTTP request logger
│   ├── passport.js          # Passport authentication (future)
│   ├── roles.js             # Role-based permissions
│   ├── swagger.js           # API documentation configuration
│   └── token.js             # JWT token utilities
├── controllers/              # Request handlers
│   ├── auth.controller.js
│   ├── contactus.controllers.js
│   ├── meal.controller.js
│   ├── mess.controller.js
│   ├── order.controller.js
│   ├── profile.contorllers.js
│   ├── review.controller.js
│   └── User.controller.js
├── docs/                     # Documentation
│   └── api-docs.js          # Swagger documentation schemas
├── errors/                   # Custom error classes
│   ├── BadRequestError.js
│   ├── CutomeAPIError.js
│   ├── ForbiddenError.js
│   ├── NotFoundError.js
│   ├── UnauthorizedError.js
│   └── index.js
├── middleware/               # Express middleware
│   ├── auth.middleware.js
│   ├── authorizeRoles.middelware.js
│   ├── error.middelware.js
│   ├── notfound.middelware.js
│   └── validator.middelware.js
├── model/                    # Database models
│   ├── user.model.js
│   ├── CustomerProfile.model.js
│   ├── OwnerProfile.model.js
│   ├── Mess.model.js
│   ├── Meal.model.js
│   ├── order.model.js
│   ├── review.model.js
│   └── contactus.model.js
├── routes/                   # Route definitions
│   ├── index.js
│   ├── auth.routes.js
│   ├── profile.routes.js
│   ├── menu.routes.js
│   ├── mess.routes.js
│   ├── orders.routes.js
│   ├── User.routes.js
│   ├── review.routes.js
│   └── contactus.routes.js
├── services/                 # Business logic services
│   └── connectDB.js
├── utils/                    # Utility functions
│   └── catchAsync.js        # Async error handler wrapper
└── validators/               # Input validation schemas
```

## Core Components

### 1. Application Entry Point

**File**: `server.js`

- Initializes database connection
- Starts Express server
- Handles server errors
- Environment validation

**File**: `app.js`

- Express application setup
- Middleware registration
- Route mounting
- CORS configuration
- Swagger documentation setup
- Global error handling

### 2. Configuration Layer

**Purpose**: Centralized configuration management

**Files**:
- `config/config.js` - Environment variables and configuration
- `config/logger.js` - Winston logger configuration
- `config/morgan.js` - HTTP request logging
- `config/swagger.js` - API documentation setup
- `config/roles.js` - Role-based access control definitions
- `config/token.js` - JWT token utilities

### 3. Routes Layer

**Purpose**: Define API endpoints and map to controllers

**Pattern**:
```javascript
import express from 'express';
import controller from '../controllers/resource.controller.js';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validator.middelware.js';

const router = express.Router();

router.post('/', auth, validate(schema), controller.create);
router.get('/:id', auth, controller.getById);

export default router;
```

### 4. Middleware Layer

**Components**:

#### Authentication Middleware (`auth.middleware.js`)
- Verifies JWT tokens (cookie or bearer)
- Extracts user information
- Attaches user to request object

#### Authorization Middleware (`authorizeRoles.middelware.js`)
- Role-based access control
- Permission validation
- Resource ownership verification

#### Validation Middleware (`validator.middelware.js`)
- Request body validation using Joi
- Query parameter validation
- Request sanitization

#### Error Middleware (`error.middelware.js`)
- Centralized error handling
- Error formatting
- Error logging
- HTTP status code mapping

### 5. Controller Layer

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Parse request data
- Call service layer
- Format responses
- Handle HTTP status codes
- Error delegation

**Pattern**:
```javascript
const createResource = catchAsync(async (req, res) => {
  const resource = await service.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    resource
  });
});
```

### 6. Service Layer

**Purpose**: Business logic implementation

**Responsibilities**:
- Data processing
- Business rules enforcement
- Transaction management
- External service integration

### 7. Model Layer

**Purpose**: Database schema and data access

**Pattern**:
```javascript
import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    // validations
  }
}, { timestamps: true });

// Middleware
Schema.pre('save', async function() {
  // pre-processing
});

// Methods
Schema.methods.customMethod = function() {
  // instance methods
};

export default mongoose.model('ModelName', Schema);
```

## Design Patterns

### 1. Repository Pattern
Models act as repositories for data access, abstracting MongoDB operations.

### 2. Dependency Injection
Services and utilities are injected into controllers, promoting testability.

### 3. Factory Pattern
Custom error classes follow factory pattern for consistent error creation.

### 4. Middleware Chain
Express middleware chain for request processing pipeline.

### 5. Async/Await with Error Handling
`catchAsync` wrapper for automatic error handling in async routes.

## Authentication Flow

```
1. User sends credentials → POST /auth/login
2. Auth controller validates input
3. Service layer verifies credentials
4. User model compares password hash
5. JWT token generated and signed
6. Token set in httpOnly cookie
7. Token also returned in response
8. Client stores token (cookie or localStorage)
9. Subsequent requests include token
10. Auth middleware verifies token
11. User info attached to req.user
12. Controller accesses req.user
```

## Authorization Flow

```
1. Request includes JWT token
2. Auth middleware verifies token
3. User role extracted from token
4. Authorization middleware checks role
5. Resource ownership verified (if needed)
6. Permissions validated against roles.js
7. Request proceeds or 403 Forbidden returned
```

## Error Handling Strategy

### Custom Error Classes
- `CustomAPIError` - Base error class
- `BadRequestError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `NotFoundError` - 404 errors

### Error Flow
```
1. Error thrown in controller/service
2. catchAsync wrapper catches error
3. Error passed to error middleware
4. Error formatted with status code
5. Response sent to client
6. Error logged to console/file
```

## Database Design Principles

### 1. Schema Validation
All models include field validation and constraints.

### 2. Relationships
- User → CustomerProfile (1:1)
- User → OwnerProfile (1:1)
- Owner → Mess (1:N)
- Mess → Meal (1:N)
- Customer → Order (1:N)
- Order → Meal (N:N through orderItems)
- Customer → Review (1:N)
- Mess → Review (1:N)

### 3. Timestamps
All models use `{ timestamps: true }` for automatic createdAt/updatedAt.

### 4. Indexes
Strategic indexing on frequently queried fields (email, messId, userId).

## API Design Principles

### 1. RESTful Conventions
- Resources as nouns
- HTTP verbs for actions
- Proper status codes
- Consistent URL structure

### 2. Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### 3. Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### 4. Versioning Strategy
Currently v1 (implicit), future versions can use `/api/v2` prefix.

## Security Measures

### 1. Authentication
- JWT token-based authentication
- httpOnly cookies to prevent XSS
- Token expiration (30 days)
- Secure password hashing (bcrypt)

### 2. Authorization
- Role-based access control (RBAC)
- Resource ownership verification
- Permission-based operations

### 3. Data Validation
- Input validation using Joi schemas
- Mongoose schema validation
- Request sanitization

### 4. Security Headers
- CORS configuration
- Content-Type validation
- HTTP-only cookies

### 5. Password Security
- Minimum length requirements
- Bcrypt hashing (salted)
- Pre-save hashing middleware

## Scalability Considerations

### 1. Horizontal Scaling
- Stateless authentication (JWT)
- No server-side session storage
- Database connection pooling

### 2. Caching Strategy (Future)
- Redis for session management
- Query result caching
- Rate limiting cache

### 3. Database Optimization
- Indexed fields for frequent queries
- Lean queries for better performance
- Pagination for large datasets

### 4. Load Balancing (Future)
- Multiple server instances
- Sticky sessions not required (JWT)
- Database replica sets

## Testing Strategy (Planned)

### 1. Unit Tests
- Service layer logic
- Utility functions
- Model methods

### 2. Integration Tests
- API endpoint testing
- Database operations
- Authentication flow

### 3. End-to-End Tests
- Complete user workflows
- Multi-step operations
- Error scenarios

## Monitoring & Logging

### Current Implementation
- Morgan for HTTP request logging
- Winston for application logging
- Console error output

### Future Enhancements
- Centralized logging service
- Performance monitoring
- Error tracking (Sentry)
- Analytics dashboard

## Configuration Management

### Environment Variables
```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/mamas-kitchen
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION_MINUTES=43200
NODE_ENV=development
```

### Config Structure
- Development config
- Production config
- Test config
- Environment-specific settings

## Deployment Architecture (Planned)

```
┌──────────────┐
│   Nginx      │ (Reverse Proxy, SSL)
└──────┬───────┘
       │
┌──────▼───────┐
│ Load Balancer│
└──────┬───────┘
       │
   ┌───┴────────────┐
   │                │
┌──▼──┐        ┌───▼──┐
│Node │        │Node  │  (Multiple instances)
│App 1│        │App 2 │
└──┬──┘        └───┬──┘
   │               │
   └───────┬───────┘
           │
    ┌──────▼──────┐
    │  MongoDB    │  (Replica Set)
    │  Cluster    │
    └─────────────┘
```

## Future Enhancements

### 1. Microservices
- Payment service
- Notification service
- Analytics service
- Image processing service

### 2. Message Queue
- Order processing queue
- Email notification queue
- Data analytics queue

### 3. Caching Layer
- Redis for sessions
- Query result caching
- API response caching

### 4. API Gateway
- Rate limiting
- Request throttling
- API versioning
- Request routing

### 5. Real-time Features
- WebSocket for live updates
- Order status notifications
- Chat support
- Live tracking

## Best Practices Implemented

1. **Separation of Concerns** - Each layer has specific responsibilities
2. **DRY Principle** - Reusable middleware and utilities
3. **Error Handling** - Centralized error management
4. **Security First** - Authentication, authorization, validation
5. **Code Organization** - Logical file and folder structure
6. **Environment Config** - Environment-based configuration
7. **Documentation** - Swagger API documentation
8. **Version Control** - Git with semantic commits
9. **Code Style** - Consistent formatting and naming
10. **Async/Await** - Modern asynchronous JavaScript
