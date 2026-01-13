# Architecture Overview

## System Architecture

Mama's Kitchen follows a layered MVC (Model-View-Controller) architecture with RESTful API design principles.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│           (React Frontend / Mobile App)                  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/HTTPS
                      │ (JSON)
┌─────────────────────▼───────────────────────────────────┐
│                  API Gateway Layer                       │
│                  (Express.js App)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Middleware Stack                       │   │
│  │  • CORS                                          │   │
│  │  • Cookie Parser                                 │   │
│  │  • JSON Parser                                   │   │
│  │  • Authentication (JWT)                          │   │
│  │  • Authorization (RBAC)                          │   │
│  │  • Validation (Joi)                              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               Controller Layer                           │
│  ┌──────────────┬──────────────┬─────────────────────┐  │
│  │ Auth         │ Profile      │ Mess/Meal           │  │
│  │ Controller   │ Controller   │ Controller          │  │
│  └──────────────┴──────────────┴─────────────────────┘  │
│           (Business Logic & Orchestration)               │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 Model Layer                              │
│  ┌──────┬─────────┬────────┬──────┬──────────────────┐  │
│  │ User │Customer │ Owner  │ Mess │ Meal             │  │
│  │Model │ Profile │Profile │Model │ Model            │  │
│  └──────┴─────────┴────────┴──────┴──────────────────┘  │
│           (Data Schemas & Validation)                    │
└─────────────────────┬───────────────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────────────┐
│              Database Layer                              │
│                  MongoDB                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Collections:                                    │   │
│  │  • users                                         │   │
│  │  • customers                                     │   │
│  │  • owners                                        │   │
│  │  • messes                                        │   │
│  │  • meals                                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Request Flow

### Authentication Flow

```
1. User Registration
   ┌──────┐     POST /auth/register      ┌──────────┐
   │Client├──────────────────────────────►│  Router  │
   └──────┘                               └────┬─────┘
                                               │
                                    ┌──────────▼────────┐
                                    │  Validator        │
                                    │  (Joi Schema)     │
                                    └──────────┬────────┘
                                               │
                                    ┌──────────▼────────┐
                                    │ Auth Controller   │
                                    │ • Hash password   │
                                    │ • Create user     │
                                    │ • Generate JWT    │
                                    └──────────┬────────┘
                                               │
                                    ┌──────────▼────────┐
                                    │  User Model       │
                                    │  (MongoDB)        │
                                    └──────────┬────────┘
                                               │
   ┌──────┐     {user, token}               ┌──┴──────┐
   │Client│◄────────────────────────────────┤Response │
   └──────┘     Cookie: token=jwt           └─────────┘

2. Subsequent Requests
   ┌──────┐     GET /profile/customer     ┌──────────┐
   │Client├───────────────────────────────►│  Router  │
   └──────┘     Cookie: token=jwt          └────┬─────┘
                                                │
                                    ┌───────────▼──────┐
                                    │ Auth Middleware  │
                                    │ • Verify JWT     │
                                    │ • Attach user    │
                                    └───────────┬──────┘
                                                │
                                    ┌───────────▼──────┐
                                    │ Authorize Roles  │
                                    │ • Check role     │
                                    └───────────┬──────┘
                                                │
                                    ┌───────────▼──────┐
                                    │ Controller       │
                                    └───────────┬──────┘
                                                │
   ┌──────┐     {profile}                   ┌──┴──────┐
   │Client│◄───────────────────────────────┤Response  │
   └──────┘                                 └──────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Data Relationships                    │
└─────────────────────────────────────────────────────────┘

    ┌──────────┐
    │   User   │
    │  (Auth)  │
    └────┬─────┘
         │
         │ role: CUSTOMER
         ├────────────────────┐
         │                    │
    ┌────▼──────┐        ┌────▼──────┐
    │ Customer  │        │   Owner   │
    │  Profile  │        │  Profile  │
    └───────────┘        └────┬──────┘
                              │
                         ┌────▼──────┐
                         │   Mess    │
                         │ (Service) │
                         └────┬──────┘
                              │
                         ┌────▼──────┐
                         │   Meal    │
                         │  (Items)  │
                         └───────────┘

Future:
    Customer ──► Order ──► OrderItems ──► Meal
    Customer ──► Review ──► Mess/Meal
```

## Directory Structure Explained

```
src/
│
├── config/                    # Configuration files
│   └── db.config.js          # Database connection setup
│
├── controllers/               # Business logic layer
│   ├── auth.controller.js    # Authentication operations
│   ├── meal.controller.js    # Meal CRUD operations
│   ├── mess.controller.js    # Mess CRUD operations
│   └── profile.controller.js # Profile management
│
├── errors/                    # Custom error classes
│   ├── BadRequestError.js    # 400 errors
│   ├── CutomeAPIError.js     # Base error class
│   ├── ForbiddenError.js     # 403 errors
│   ├── NotFoundError.js      # 404 errors
│   ├── UnauthorizedError.js  # 401 errors
│   └── index.js              # Error exports
│
├── middleware/                # Express middleware
│   ├── auth.middleware.js    # JWT authentication
│   ├── authorizeRoles.js     # Role-based access control
│   └── validator.js          # Joi validation
│
├── model/                     # Mongoose schemas
│   ├── user.model.js         # User authentication
│   ├── CustomerProfile.js    # Customer data
│   ├── OwnerProfile.js       # Owner data
│   ├── Mess.model.js         # Mess/service data
│   └── Meal.model.js         # Meal catalog
│
├── routes/                    # API endpoints
│   ├── auth.routes.js        # /auth/* endpoints
│   ├── mess.routes.js        # /mess/* endpoints
│   └── profile.routes.js     # /profile/* endpoints
│
├── validators/                # Joi schemas
│   ├── auth.validators.js    # Auth validation rules
│   ├── meal.validator.js     # Meal validation rules
│   └── profile.validators.js # Profile validation rules
│
├── app.js                     # Express app setup
└── server.js                  # Server entry point
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────┐
│              Security Layers                             │
└─────────────────────────────────────────────────────────┘

Layer 1: Password Security
   • Bcrypt hashing (10 rounds)
   • Pre-save hook in User model
   • Never store plain text

Layer 2: JWT Tokens
   • Signed with secret key
   • 30-day expiration
   • Payload: {userId, name, role}

Layer 3: Middleware Stack
   ┌──────────────────────┐
   │ 1. auth.middleware   │ ──► Verify JWT
   └──────────┬───────────┘
              │
   ┌──────────▼───────────┐
   │ 2. authorizeRoles    │ ──► Check RBAC
   └──────────┬───────────┘
              │
   ┌──────────▼───────────┐
   │ 3. validator         │ ──► Validate input
   └──────────┬───────────┘
              │
              ▼
         Controller

Layer 4: Data Validation
   • Mongoose schema validation
   • Joi request validation
   • Type checking
```

### Role-Based Access Control (RBAC)

```
┌──────────────┬─────────────────────────────────────────┐
│     Role     │           Permissions                   │
├──────────────┼─────────────────────────────────────────┤
│  CUSTOMER    │ • Create/Read/Update own profile        │
│              │ • View all messes and meals             │
│              │ • Create orders (future)                │
│              │ • Write reviews (future)                │
├──────────────┼─────────────────────────────────────────┤
│  OWNER       │ • Create/Read/Update own profile        │
│              │ • Create/Read/Update/Delete own mess    │
│              │ • Create/Read/Update/Delete own meals   │
│              │ • View orders (future)                  │
│              │ • Manage business (future)              │
└──────────────┴─────────────────────────────────────────┘

Future Roles:
   ADMIN      - System administration
   MODERATOR  - Content moderation
```

## Database Design

### Collection Relationships

```sql
users
  _id (PK)
  ├─► customers.userId (FK)
  ├─► owners.userId (FK)
  └─► messes.ownerId (FK)

messes
  _id (PK)
  └─► meals.messId (FK)

Future:
orders
  _id (PK)
  ├─► users._id (customerId)
  └─► messes._id (messId)

orderItems
  _id (PK)
  ├─► orders._id (orderId)
  └─► meals._id (mealId)
```

### Indexing Strategy (Planned)

```javascript
// Unique indexes
users: { email: 1 }
customers: { userId: 1 }
owners: { userId: 1 }
messes: { ownerId: 1 }

// Query optimization indexes
meals: { messId: 1, mealType: 1 }
meals: { is_Available: 1 }
messes: { area: 1, is_Active: 1 }

// Text search indexes (future)
messes: { name: 'text', description: 'text' }
meals: { name: 'text', description: 'text' }
```

## Scalability Considerations

### Horizontal Scaling

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   App      │     │   App      │     │   App      │
│ Instance 1 │     │ Instance 2 │     │ Instance 3 │
└─────┬──────┘     └─────┬──────┘     └─────┬──────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
                  ┌──────▼──────┐
                  │ Load        │
                  │ Balancer    │
                  └──────┬──────┘
                         │
                  ┌──────▼──────┐
                  │  MongoDB    │
                  │  Cluster    │
                  └─────────────┘
```

### Caching Strategy (Future)

```
Redis Cache Layer
   ├─► Session storage
   ├─► JWT token blacklist
   ├─► Frequently accessed messes
   └─► Popular meals
```

## Error Handling Flow

```
Error Occurs
    │
    ├─► Custom Error?
    │      ├─► Yes: Use statusCode from error
    │      └─► No:  Default to 500
    │
    ├─► Validation Error? (Joi)
    │      └─► Return 400 with error array
    │
    ├─► Mongoose Error?
    │      ├─► Duplicate Key: 400
    │      ├─► Validation: 400
    │      └─► Cast Error: 400
    │
    └─► Unknown Error
           └─► Log error, return 500
```

## Performance Optimization

### Current

- Mongoose lean queries for read-only operations
- Selective field projection
- Connection pooling (default)

### Planned

- Query result caching
- Database indexing
- Response compression
- Request rate limiting
- Pagination implementation
- API response caching headers

---

**Last Updated:** January 13, 2026
