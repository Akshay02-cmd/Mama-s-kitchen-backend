# API Endpoints Documentation

## Base URL

**Development**: `http://localhost:5000`  
**Production**: `https://api.mamaskitchen.com` (planned)

## API Documentation

Interactive API documentation available at: `/api-docs` (Swagger UI)

## Authentication

Most endpoints require authentication via JWT token.

**Methods**:
1. **Cookie-based** (httpOnly cookie named `token`)
2. **Bearer token** (Authorization header)

**Header Format**:
```
Authorization: Bearer <your-jwt-token>
```

## Global Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## Authentication Endpoints

### Register User

**Endpoint**: `POST /auth/register`

**Access**: Public

**Description**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Validations**:
- `name`: 3-30 characters, required
- `email`: Valid email format, unique, required
- `password`: Minimum 6 characters, required
- `role`: Must be "CUSTOMER" or "OWNER", required

**Success Response** (201 Created):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "createdAt": "2026-02-09T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- `400 Bad Request`: Validation error or duplicate email
- `500 Internal Server Error`: Server error

---

### Login User

**Endpoint**: `POST /auth/login`

**Access**: Public

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Validations**:
- `email`: Valid email format, required
- `password`: Required
- `role`: Must match user's actual role, required

**Success Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- `400 Bad Request`: Missing fields or role mismatch
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### Logout User

**Endpoint**: `POST /auth/logout`

**Access**: Public (but recommended to call when authenticated)

**Description**: Clear authentication cookie and logout user

**Request Body**: None

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Profile Endpoints

### Get Customer Profile

**Endpoint**: `GET /profile/customer`

**Access**: Authenticated (CUSTOMER role)

**Description**: Retrieve logged-in customer's profile

**Request Body**: None

**Success Response** (200 OK):
```json
{
  "success": true,
  "profile": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "phone": "9876543210",
    "address": "123 Main Street, Nashik",
    "dietaryPreferences": {
      "is_Veg": true,
      "allergies": ["peanuts"],
      "favoriteCuisines": ["Indian", "Chinese"]
    },
    "createdAt": "2026-02-09T10:30:00Z",
    "updatedAt": "2026-02-09T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Profile not created yet
- `500 Internal Server Error`: Server error

---

### Create Customer Profile

**Endpoint**: `POST /profile/customer`

**Access**: Authenticated (CUSTOMER role)

**Description**: Create customer profile (first-time setup)

**Request Body**:
```json
{
  "phone": "9876543210",
  "address": "123 Main Street, Nashik, Maharashtra",
  "dietaryPreferences": {
    "is_Veg": true,
    "allergies": ["peanuts", "shellfish"],
    "favoriteCuisines": ["Indian", "Chinese", "Italian"]
  }
}
```

**Validations**:
- `phone`: Indian mobile format (10 digits, starts with 6-9), required
- `address`: 10-300 characters, required
- `dietaryPreferences`: Optional object

**Success Response** (201 Created):
```json
{
  "success": true,
  "profile": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "phone": "9876543210",
    "address": "123 Main Street, Nashik, Maharashtra",
    "dietaryPreferences": {
      "is_Veg": true,
      "allergies": ["peanuts", "shellfish"],
      "favoriteCuisines": ["Indian", "Chinese", "Italian"]
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error or profile already exists
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

### Update Customer Profile

**Endpoint**: `PUT /profile/customer`

**Access**: Authenticated (CUSTOMER role)

**Description**: Update customer profile information

**Request Body**: Same as Create (partial updates supported)

**Success Response** (200 OK): Same as Create

---

### Get Owner Profile

**Endpoint**: `GET /profile/owner`

**Access**: Authenticated (OWNER role)

**Description**: Retrieve logged-in owner's profile

---

### Create Owner Profile

**Endpoint**: `POST /profile/owner`

**Access**: Authenticated (OWNER role)

**Description**: Create owner profile

**Request Body**:
```json
{
  "businessName": "Mama's Kitchen Catering",
  "phone": "9876543210",
  "address": "456 Business Park, Nashik",
  "gstin": "27AABCU9603R1ZM",
  "description": "We provide homely meals with authentic taste"
}
```

---

### Update Owner Profile

**Endpoint**: `PUT /profile/owner`

**Access**: Authenticated (OWNER role)

**Description**: Update owner profile information

---

## Mess Endpoints

### Get All Messes

**Endpoint**: `GET /mess`

**Access**: Public or Authenticated

**Description**: Retrieve all active messes

**Query Parameters**:
- `area`: Filter by area (optional)
- `is_Active`: Filter by active status (optional, default: true)

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 10,
  "messes": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "ownerId": "507f1f77bcf86cd799439012",
      "name": "Mama's Kitchen",
      "area": "Nashik Road",
      "phone": "9876543210",
      "address": "123 Main Street, Nashik",
      "description": "Homely meals with authentic taste",
      "is_Active": true,
      "createdAt": "2026-02-09T10:30:00Z"
    }
  ]
}
```

---

### Get Mess by ID

**Endpoint**: `GET /mess/:id`

**Access**: Public or Authenticated

**Description**: Retrieve specific mess details

**URL Parameters**:
- `id`: Mess ObjectId

**Success Response** (200 OK):
```json
{
  "success": true,
  "mess": {
    "_id": "507f1f77bcf86cd799439011",
    "ownerId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Owner Name",
      "email": "owner@example.com"
    },
    "name": "Mama's Kitchen",
    "area": "Nashik Road",
    "phone": "9876543210",
    "address": "123 Main Street, Nashik",
    "description": "Homely meals with authentic taste",
    "is_Active": true
  }
}
```

**Error Responses**:
- `404 Not Found`: Mess not found
- `500 Internal Server Error`: Server error

---

### Create Mess

**Endpoint**: `POST /mess`

**Access**: Authenticated (OWNER role)

**Description**: Create a new mess (owner must have completed profile)

**Request Body**:
```json
{
  "name": "Mama's Kitchen",
  "area": "Nashik Road",
  "phone": "9876543210",
  "address": "123 Main Street, Nashik, Maharashtra",
  "description": "We serve homely meals with authentic Indian taste"
}
```

**Validations**:
- `name`: 3-100 characters, required
- `area`: 3-100 characters, required
- `phone`: Indian mobile format, required
- `address`: 10-300 characters, required
- `description`: 10-500 characters, required

**Success Response** (201 Created):
```json
{
  "success": true,
  "mess": {
    "_id": "507f1f77bcf86cd799439011",
    "ownerId": "507f1f77bcf86cd799439012",
    "name": "Mama's Kitchen",
    "area": "Nashik Road",
    "phone": "9876543210",
    "address": "123 Main Street, Nashik, Maharashtra",
    "description": "We serve homely meals with authentic Indian taste",
    "is_Active": true
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an owner or profile incomplete
- `400 Bad Request`: Validation error
- `500 Internal Server Error`: Server error

---

### Update Mess

**Endpoint**: `PUT /mess/:id`

**Access**: Authenticated (OWNER role, must own the mess)

**Description**: Update mess information

**URL Parameters**:
- `id`: Mess ObjectId

**Request Body**: Same as Create (partial updates supported)

**Success Response** (200 OK): Same as Create

---

### Delete Mess

**Endpoint**: `DELETE /mess/:id`

**Access**: Authenticated (OWNER role, must own the mess)

**Description**: Soft delete mess (sets is_Active to false)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Mess deleted successfully"
}
```

---

## Menu/Meal Endpoints

### Get All Meals

**Endpoint**: `GET /menu`

**Access**: Public or Authenticated

**Description**: Retrieve all available meals

**Query Parameters**:
- `messId`: Filter by mess ID (optional)
- `mealType`: Filter by type - breakfast/lunch/dinner/snack (optional)
- `is_Veg`: Filter vegetarian (true/false) (optional)
- `is_Available`: Filter availability (optional, default: true)

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 25,
  "meals": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "messId": "507f1f77bcf86cd799439012",
      "name": "Paneer Butter Masala",
      "mealType": "lunch",
      "is_Veg": true,
      "description": "Creamy paneer curry with rich tomato gravy",
      "price": 120,
      "is_Available": true,
      "createdAt": "2026-02-09T10:30:00Z"
    }
  ]
}
```

---

### Get Meal by ID

**Endpoint**: `GET /menu/:id`

**Access**: Public or Authenticated

**Description**: Retrieve specific meal details with mess information

**Success Response** (200 OK):
```json
{
  "success": true,
  "meal": {
    "_id": "507f1f77bcf86cd799439011",
    "messId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Mama's Kitchen",
      "area": "Nashik Road",
      "phone": "9876543210"
    },
    "name": "Paneer Butter Masala",
    "mealType": "lunch",
    "is_Veg": true,
    "description": "Creamy paneer curry with rich tomato gravy",
    "price": 120,
    "is_Available": true
  }
}
```

---

### Create Meal

**Endpoint**: `POST /menu`

**Access**: Authenticated (OWNER role, must own the mess)

**Description**: Add a new meal to menu

**Request Body**:
```json
{
  "messId": "507f1f77bcf86cd799439012",
  "name": "Paneer Butter Masala",
  "mealType": "lunch",
  "is_Veg": true,
  "description": "Creamy paneer curry with rich tomato gravy",
  "price": 120
}
```

**Validations**:
- `messId`: Valid ObjectId, must belong to owner, required
- `name`: 3-100 characters, required
- `mealType`: "breakfast", "lunch", "dinner", or "snack", required
- `is_Veg`: Boolean, required
- `description`: 10-500 characters, required
- `price`: Number >= 0, required

**Success Response** (201 Created):
```json
{
  "success": true,
  "meal": {
    "_id": "507f1f77bcf86cd799439011",
    "messId": "507f1f77bcf86cd799439012",
    "name": "Paneer Butter Masala",
    "mealType": "lunch",
    "is_Veg": true,
    "description": "Creamy paneer curry with rich tomato gravy",
    "price": 120,
    "is_Available": true
  }
}
```

---

### Update Meal

**Endpoint**: `PUT /menu/:id`

**Access**: Authenticated (OWNER role, must own the mess)

**Description**: Update meal information

---

### Delete Meal

**Endpoint**: `DELETE /menu/:id`

**Access**: Authenticated (OWNER role, must own the mess)

**Description**: Soft delete meal (sets is_Available to false)

---

## Order Endpoints

### Get All Orders

**Endpoint**: `GET /orders`

**Access**: Authenticated

**Description**: Retrieve orders
- **CUSTOMER**: Returns their own orders
- **OWNER**: Returns orders containing their mess meals

**Query Parameters**:
- `status`: Filter by status (optional)
- `limit`: Pagination limit (default: 20)
- `page`: Page number (default: 1)

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "orderItems": [
        {
          "mealId": {
            "_id": "507f1f77bcf86cd799439013",
            "name": "Paneer Butter Masala",
            "price": 120
          },
          "quantity": 2,
          "price": 120
        }
      ],
      "totalAmount": 240,
      "deliveryAddress": "123 Main Street, Nashik",
      "deliveryPhone": "9876543210",
      "status": "PLACED",
      "paymentMethod": "UPI",
      "paymentStatus": "PENDING",
      "createdAt": "2026-02-09T10:30:00Z"
    }
  ]
}
```

---

### Get Order by ID

**Endpoint**: `GET /orders/:id`

**Access**: Authenticated (customer who placed it or mess owner)

**Description**: Retrieve specific order details

---

### Create Order

**Endpoint**: `POST /orders`

**Access**: Authenticated (CUSTOMER role, profile must be complete)

**Description**: Place a new order

**Request Body**:
```json
{
  "orderItems": [
    {
      "mealId": "507f1f77bcf86cd799439013",
      "quantity": 2
    },
    {
      "mealId": "507f1f77bcf86cd799439014",
      "quantity": 1
    }
  ],
  "deliveryAddress": "123 Main Street, Nashik, Maharashtra",
  "deliveryPhone": "9876543210",
  "paymentMethod": "UPI",
  "notes": "Please deliver before 1 PM",
  "deliveryTime": "2026-02-10T13:00:00Z"
}
```

**Validations**:
- `orderItems`: Array with at least one item, required
- `orderItems.mealId`: Valid ObjectId, meal must be available, required
- `orderItems.quantity`: Integer >= 1, required
- `deliveryAddress`: Required
- `deliveryPhone`: Required
- `paymentMethod`: "CREDIT_CARD", "DEBIT_CARD", "UPI", or "COD", required
- `notes`: Max 500 characters, optional
- `deliveryTime`: Valid date, optional

**Success Response** (201 Created):
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "orderItems": [...],
    "totalAmount": 360,
    "status": "PLACED",
    "paymentStatus": "PENDING"
  }
}
```

---

### Update Order Status

**Endpoint**: `PUT /orders/:id`

**Access**: Authenticated
- **OWNER**: Can update to "PREPARING" or "DELIVERED"
- **CUSTOMER**: Can update to "CANCELLED" (only if status is "PLACED")

**Request Body**:
```json
{
  "status": "PREPARING"
}
```

---

## Review Endpoints

### Get All Reviews

**Endpoint**: `GET /reviews`

**Access**: Public or Authenticated

**Description**: Retrieve reviews

**Query Parameters**:
- `messId`: Filter by mess (optional)
- `mealId`: Filter by meal (optional)
- `rating`: Filter by rating (optional)

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 15,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe"
      },
      "messId": "507f1f77bcf86cd799439013",
      "mealId": "507f1f77bcf86cd799439014",
      "rating": 5,
      "comment": "Excellent food quality and taste!",
      "isVerifiedPurchase": true,
      "createdAt": "2026-02-09T10:30:00Z"
    }
  ]
}
```

---

### Create Review

**Endpoint**: `POST /reviews`

**Access**: Authenticated (CUSTOMER role)

**Description**: Submit a review for a mess or meal

**Request Body**:
```json
{
  "messId": "507f1f77bcf86cd799439013",
  "mealId": "507f1f77bcf86cd799439014",
  "rating": 5,
  "comment": "Excellent food quality and amazing taste!"
}
```

**Validations**:
- `messId`: Valid ObjectId, required
- `mealId`: Valid ObjectId, optional
- `rating`: Integer 1-5, required
- `comment`: 10-500 characters, required

---

### Update Review

**Endpoint**: `PUT /reviews/:id`

**Access**: Authenticated (must be review author)

**Description**: Update own review

---

### Delete Review

**Endpoint**: `DELETE /reviews/:id`

**Access**: Authenticated (must be review author)

**Description**: Delete own review

---

## User Endpoints

### Get All Users

**Endpoint**: `GET /users`

**Access**: Authenticated (ADMIN role - future implementation)

**Description**: Retrieve all users (admin only)

---

### Get User by ID

**Endpoint**: `GET /users/:id`

**Access**: Authenticated

**Description**: Retrieve specific user information (limited fields)

---

## Contact Endpoints

### Submit Contact Request

**Endpoint**: `POST /contacts`

**Access**: Public or Authenticated

**Description**: Submit a contact/support request

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "subject": "Query about meal delivery",
  "message": "I would like to know about delivery timings in my area"
}
```

**Validations**:
- `name`: 3-50 characters, required
- `email`: Valid email format, required
- `phone`: Indian mobile format, optional
- `subject`: 5-100 characters, required
- `message`: 10-1000 characters, required

---

### Get All Contact Requests

**Endpoint**: `GET /contacts`

**Access**: Authenticated (ADMIN role)

**Description**: Retrieve all contact requests (admin only)

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid data |
| 401 | Unauthorized - Authentication required or invalid |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Rate Limiting (Planned)

Future implementation will include:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user
- Stricter limits on auth endpoints

## Versioning

Current version: v1 (implicit, no prefix)  
Future versions will use: `/api/v2/...`
