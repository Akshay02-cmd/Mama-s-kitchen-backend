# Routes Module

Express router definitions that map HTTP endpoints to controller functions.

## Overview

Routes define the API structure and connect URLs to their handlers. Each route file groups related endpoints together.

## Files

### auth.routes.js
Authentication endpoints for user registration and login.

**Base Path:** `/auth`

**Endpoints:**

| Method | Path | Middleware | Controller | Description |
|--------|------|------------|------------|-------------|
| POST | `/register` | validate(RegisterSchema) | register | Create new user account |
| POST | `/login` | validate(LoginSchema) | login | Authenticate user |

**Example Requests:**
```javascript
// Register
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}

// Login
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

### profile.routes.js
User profile management for customers and owners.

**Base Path:** `/profile`

**Customer Endpoints:**

| Method | Path | Middleware | Controller | Description |
|--------|------|------------|------------|-------------|
| GET | `/customer` | auth, authorizeRoles('CUSTOMER') | GetProfileCustomer | Get customer profile |
| POST | `/customer` | auth, authorizeRoles('CUSTOMER'), validate(CustomerSchema) | CreateProfileCustomer | Create customer profile |
| PUT | `/customer` | auth, authorizeRoles('CUSTOMER'), validate(UpdateProfileSchema) | UpdateProfileCustomer | Update customer profile |

**Owner Endpoints:**

| Method | Path | Middleware | Controller | Description |
|--------|------|------------|------------|-------------|
| GET | `/owner` | auth, authorizeRoles('OWNER') | GetProfileOwner | Get owner profile |
| POST | `/owner` | auth, authorizeRoles('OWNER'), validate(OwnerSchema) | CreateProfileOwner | Create owner profile |
| PUT | `/owner` | auth, authorizeRoles('OWNER'), validate(UpdateProfileSchema) | UpdateProfileOwner | Update owner profile |

**Example Requests:**
```javascript
// Create Customer Profile
POST /profile/customer
Authorization: Bearer <token>
{
  "phone": "9876543210",
  "address": "123 Main Street, Nashik"
}

// Update Owner Profile
PUT /profile/owner
Authorization: Bearer <token>
{
  "phone": "9876543211",
  "address": "456 New Street, Nashik"
}
```

### mess.routes.js
Mess and meal management endpoints.

**Base Path:** `/mess`

**Mess Endpoints:**

| Method | Path | Middleware | Controller | Description |
|--------|------|------------|------------|-------------|
| GET | `/` | - | getallMesses | List all messes |
| POST | `/` | auth, authorizeRoles('OWNER'), validate(MessSchema) | createMess | Create new mess |
| GET | `/:messid` | - | getMess | Get single mess |
| PUT | `/:messid` | auth, authorizeRoles('OWNER'), validate(UpdateMessSchema) | updateMess | Update mess |
| DELETE | `/:messid` | auth, authorizeRoles('OWNER') | deleteMess | Delete mess |

**Meal Endpoints:**

| Method | Path | Middleware | Controller | Description |
|--------|------|------------|------------|-------------|
| GET | `/:messid/meals` | - | getallMeals | List all meals for mess |
| POST | `/:messid/meals` | auth, authorizeRoles('OWNER'), validate(MealSchema) | createMeal | Create meal |
| GET | `/:messid/meals/:mealId` | - | getMeal | Get single meal |
| PUT | `/:messid/meals/:mealId` | auth, authorizeRoles('OWNER'), validate(UpdateMealSchema) | updateMeal | Update meal |
| DELETE | `/:messid/meals/:mealId` | auth, authorizeRoles('OWNER') | deleteMeal | Delete meal |

**Example Requests:**
```javascript
// Create Mess
POST /mess
Authorization: Bearer <token>
{
  "messName": "Mama's Kitchen",
  "area": "Panchavati",
  "phone": "9876543210",
  "address": "123 Food Street",
  "description": "Authentic homemade meals"
}

// Create Meal
POST /mess/648a1b2c3d4e5f6g/meals
Authorization: Bearer <token>
{
  "name": "Paneer Butter Masala",
  "mealType": "lunch",
  "is_Veg": true,
  "description": "Delicious paneer curry",
  "price": 120,
  "is_Available": true
}
```

## Route Organization

### Public Routes
No authentication required:
- GET all messes
- GET single mess
- GET all meals
- GET single meal

### Protected Routes (CUSTOMER)
Requires authentication + CUSTOMER role:
- Customer profile CRUD

### Protected Routes (OWNER)
Requires authentication + OWNER role:
- Owner profile CRUD
- Mess CRUD
- Meal CRUD

## Middleware Chain

Routes use middleware in this order:

1. **Authentication** (`auth`)
   - Verifies JWT token
   - Attaches user to request

2. **Authorization** (`authorizeRoles`)
   - Checks user role
   - Denies access if role mismatch

3. **Validation** (`validate`)
   - Validates request body
   - Returns errors if invalid

4. **Controller**
   - Executes business logic
   - Returns response

## RESTful Conventions

| HTTP Method | CRUD Operation | Example |
|-------------|----------------|---------|
| GET | Read | Get mess details |
| POST | Create | Create new meal |
| PUT | Update | Update mess info |
| DELETE | Delete | Remove meal |

## URL Parameters

### Path Parameters
```javascript
// :messid - Mess ObjectId
GET /mess/648a1b2c3d4e5f6g7h8i9j0k

// :messid and :mealId - Multiple params
GET /mess/648a.../meals/749b...
```

### Query Parameters (Future)
```javascript
// Filtering
GET /mess?area=Panchavati&is_Active=true

// Pagination
GET /mess/:messid/meals?page=2&limit=10

// Sorting
GET /mess?sort=price&order=asc
```

## Response Format

### Success (200-299)
```javascript
{
  "success": true,
  "user": { ... },      // For auth
  "profile": { ... },   // For profile
  "mess": { ... },      // For mess
  "meal": { ... }       // For meal
}
```

### Error (400-599)
```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // For validation errors
}
```

## Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected errors |

## Best Practices

1. **Use appropriate HTTP methods**
   ```javascript
   // Correct
   router.get('/mess/:messid', getMess);
   router.delete('/mess/:messid', deleteMess);
   
   // Wrong
   router.post('/mess/get/:messid', getMess);
   ```

2. **Apply middleware in correct order**
   ```javascript
   // Correct
   router.post('/', auth, authorizeRoles('OWNER'), validate(schema), create);
   
   // Wrong - validate before auth
   router.post('/', validate(schema), auth, create);
   ```

3. **Use RESTful URL structure**
   ```javascript
   // Good
   /mess/:messid/meals/:mealId
   
   // Avoid
   /getMealByIdFromMess/:messid/:mealId
   ```

4. **Group related routes**
   ```javascript
   router.route('/customer')
     .get(auth, getProfile)
     .post(auth, createProfile)
     .put(auth, updateProfile);
   ```

## Future Enhancements

- [ ] Add query parameter support (filtering, sorting, pagination)
- [ ] Implement API versioning (/api/v1/)
- [ ] Add rate limiting per route
- [ ] Create route documentation middleware
- [ ] Add request caching for GET routes
- [ ] Implement HATEOAS links
- [ ] Add route-level analytics
- [ ] Create route testing suite
