# API Reference Documentation

## Overview

Mama's Kitchen API provides endpoints for meal ordering platform operations including user authentication, profile management, mess/catering service management, and meal catalog management.

**Base URL:** `http://localhost:5000`

**API Version:** 1.0.0

**Authentication:** JWT (JSON Web Token)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Error Codes](#error-codes)
4. [Endpoints](#endpoints)
   - [Auth Endpoints](#auth-endpoints)
   - [Profile Endpoints](#profile-endpoints)
   - [Mess Endpoints](#mess-endpoints)
   - [Meal Endpoints](#meal-endpoints)

---

## Authentication

### Methods

The API supports two authentication methods:

#### 1. Cookie-Based (Default)
```http
POST /auth/login
Cookie: token=<jwt-token>
```

#### 2. Bearer Token
```http
GET /profile/customer
Authorization: Bearer <jwt-token>
```

### Token Structure

JWT payload contains:
```json
{
  "userId": "648a1b2c3d4e5f6g7h8i9j0k",
  "name": "John Doe",
  "role": "CUSTOMER"
}
```

### Token Expiration

Default: 30 days (configurable via `JWT_LIFETIME` environment variable)

---

## Response Format

### Success Response

```json
{
  "success": true,
  "user": {
    "id": "648a1b2c3d4e5f6g7h8i9j0k",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Detailed error 1",
    "Detailed error 2"
  ]
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions for this resource |
| 404 | Not Found | Requested resource does not exist |
| 500 | Internal Server Error | Unexpected server error |

---

## Endpoints

### Auth Endpoints

#### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** None (Public)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Field Validation:**
- `name`: String, 3-50 characters, required
- `email`: Valid email format, required, unique
- `password`: String, minimum 6 characters, required
- `role`: Enum ["CUSTOMER", "OWNER"], optional (defaults based on context)

**Success Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "648a1b2c3d4e5f6g7h8i9j0k",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "\"email\" must be a valid email"
  ]
}
```

---

#### Login User

Authenticate existing user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Field Validation:**
- `email`: Valid email format, required
- `password`: String, minimum 6 characters, required
- `role`: Enum ["CUSTOMER", "OWNER"], required

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "648a1b2c3d4e5f6g7h8i9j0k",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

**Error Responses:**

*Invalid Credentials (401):*
```json
{
  "message": "Invalid credentials (email)"
}
```

*Missing Fields (400):*
```json
{
  "message": "Please provide email and password"
}
```

---

### Profile Endpoints

#### Create Customer Profile

Create profile for authenticated customer.

**Endpoint:** `POST /profile/customer`

**Authentication:** Required (CUSTOMER role)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "phone": "9876543210",
  "address": "123 Main Street, Nashik, Maharashtra, 422001"
}
```

**Field Validation:**
- `phone`: String, Indian mobile format (10 digits starting with 6-9), required
- `address`: String, 10-300 characters, required

**Success Response (201):**
```json
{
  "profile": {
    "_id": "648b1c2d3e4f5g6h7i8j9k0l",
    "userId": "648a1b2c3d4e5f6g7h8i9j0k",
    "phone": "9876543210",
    "address": "123 Main Street, Nashik, Maharashtra, 422001",
    "isProfileCompleted": false,
    "createdAt": "2026-01-13T10:30:00.000Z",
    "updatedAt": "2026-01-13T10:30:00.000Z"
  }
}
```

---

#### Get Customer Profile

Retrieve customer profile.

**Endpoint:** `GET /profile/customer`

**Authentication:** Required (CUSTOMER role)

**Success Response (200):**
```json
{
  "profile": {
    "_id": "648b1c2d3e4f5g6h7i8j9k0l",
    "userId": "648a1b2c3d4e5f6g7h8i9j0k",
    "phone": "9876543210",
    "address": "123 Main Street, Nashik",
    "isProfileCompleted": false,
    "createdAt": "2026-01-13T10:30:00.000Z",
    "updatedAt": "2026-01-13T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Customer profile not found"
}
```

---

#### Update Customer Profile

Update customer profile information.

**Endpoint:** `PUT /profile/customer`

**Authentication:** Required (CUSTOMER role)

**Request Body:**
```json
{
  "phone": "9876543211",
  "address": "456 New Street, Nashik"
}
```

**Field Validation:**
- All fields optional
- Same validation rules as create

**Success Response (200):**
```json
{
  "success": true,
  "profile": {
    "_id": "648b1c2d3e4f5g6h7i8j9k0l",
    "userId": "648a1b2c3d4e5f6g7h8i9j0k",
    "phone": "9876543211",
    "address": "456 New Street, Nashik",
    "isProfileCompleted": false,
    "updatedAt": "2026-01-13T11:00:00.000Z"
  }
}
```

---

#### Owner Profile Endpoints

Owner profile endpoints follow the same pattern as customer profiles but use `/profile/owner` path and require OWNER role.

- `POST /profile/owner` - Create owner profile
- `GET /profile/owner` - Get owner profile
- `PUT /profile/owner` - Update owner profile

---

### Mess Endpoints

#### Get All Messes

Retrieve list of all messes.

**Endpoint:** `GET /mess`

**Authentication:** None (Public)

**Success Response (200):**
```json
{
  "messes": [
    {
      "_id": "648c1d2e3f4g5h6i7j8k9l0m",
      "ownerId": "648a1b2c3d4e5f6g7h8i9j0k",
      "name": "Mama's Kitchen Nashik",
      "area": "Panchavati",
      "phone": "9876543210",
      "address": "123 Food Street, Nashik",
      "description": "Authentic homemade meals with love",
      "is_Active": true,
      "createdAt": "2026-01-10T09:00:00.000Z",
      "updatedAt": "2026-01-10T09:00:00.000Z"
    }
  ]
}
```

---

#### Create Mess

Create a new mess/catering service.

**Endpoint:** `POST /mess`

**Authentication:** Required (OWNER role)

**Request Body:**
```json
{
  "messName": "Mama's Kitchen Nashik",
  "area": "Panchavati",
  "phone": "9876543210",
  "address": "123 Food Street, Nashik, Maharashtra",
  "description": "Authentic homemade meals prepared with love and care"
}
```

**Field Validation:**
- `messName`: String, 3-100 characters, required
- `area`: String, 3-100 characters, required
- `phone`: Indian mobile format, required
- `address`: String, 10-300 characters, required
- `description`: String, 10-500 characters, required

**Success Response (201):**
```json
{
  "mess": {
    "_id": "648c1d2e3f4g5h6i7j8k9l0m",
    "ownerId": "648a1b2c3d4e5f6g7h8i9j0k",
    "name": "Mama's Kitchen Nashik",
    "area": "Panchavati",
    "phone": "9876543210",
    "address": "123 Food Street, Nashik",
    "description": "Authentic homemade meals with love",
    "is_Active": true,
    "createdAt": "2026-01-13T10:00:00.000Z",
    "updatedAt": "2026-01-13T10:00:00.000Z"
  }
}
```

---

#### Get Single Mess

Retrieve details of a specific mess.

**Endpoint:** `GET /mess/:messid`

**Authentication:** None (Public)

**URL Parameters:**
- `messid`: MongoDB ObjectId (24-character hex string)

**Success Response (200):**
```json
{
  "mess": {
    "_id": "648c1d2e3f4g5h6i7j8k9l0m",
    "ownerId": "648a1b2c3d4e5f6g7h8i9j0k",
    "name": "Mama's Kitchen Nashik",
    "area": "Panchavati",
    "phone": "9876543210",
    "address": "123 Food Street, Nashik",
    "description": "Authentic homemade meals",
    "is_Active": true
  }
}
```

**Error Response (404):**
```json
{
  "message": "Mess not found"
}
```

---

#### Update Mess

Update mess information.

**Endpoint:** `PUT /mess/:messid`

**Authentication:** Required (OWNER role)

**Request Body:**
```json
{
  "name": "Mama's Kitchen Premium",
  "description": "Updated description",
  "is_Active": true
}
```

**Success Response (200):**
```json
{
  "mess": {
    "_id": "648c1d2e3f4g5h6i7j8k9l0m",
    "name": "Mama's Kitchen Premium",
    "description": "Updated description",
    "is_Active": true,
    "updatedAt": "2026-01-13T11:30:00.000Z"
  }
}
```

---

#### Delete Mess

Remove a mess from the system.

**Endpoint:** `DELETE /mess/:messid`

**Authentication:** Required (OWNER role)

**Success Response (200):**
```json
{
  "mess": {
    "_id": "648c1d2e3f4g5h6i7j8k9l0m",
    "name": "Mama's Kitchen Nashik"
  }
}
```

---

### Meal Endpoints

#### Get All Meals

Retrieve all meals for a specific mess.

**Endpoint:** `GET /mess/:messid/meals`

**Authentication:** None (Public)

**Success Response (200):**
```json
{
  "meal": [
    {
      "_id": "648d1e2f3g4h5i6j7k8l9m0n",
      "messId": "648c1d2e3f4g5h6i7j8k9l0m",
      "name": "Paneer Butter Masala Thali",
      "mealType": "lunch",
      "is_Veg": true,
      "description": "Delicious paneer curry with roti, rice, and salad",
      "price": 120,
      "is_Available": true,
      "createdAt": "2026-01-11T08:00:00.000Z",
      "updatedAt": "2026-01-11T08:00:00.000Z"
    }
  ]
}
```

---

#### Create Meal

Add a new meal to a mess.

**Endpoint:** `POST /mess/:messid/meals`

**Authentication:** Required (OWNER role)

**Request Body:**
```json
{
  "name": "Paneer Butter Masala Thali",
  "mealType": "lunch",
  "is_Veg": true,
  "description": "Delicious paneer curry with roti, rice, dal, and salad",
  "price": 120,
  "is_Available": true
}
```

**Field Validation:**
- `name`: String, 3-100 characters, required
- `mealType`: Enum ["breakfast", "lunch", "dinner", "snack"], required
- `is_Veg`: Boolean, required
- `description`: String, 10-500 characters, required
- `price`: Number, minimum 1, required
- `is_Available`: Boolean, required

**Success Response (201):**
```json
{
  "meal": {
    "_id": "648d1e2f3g4h5i6j7k8l9m0n",
    "messId": "648c1d2e3f4g5h6i7j8k9l0m",
    "name": "Paneer Butter Masala Thali",
    "mealType": "lunch",
    "is_Veg": true,
    "description": "Delicious paneer curry",
    "price": 120,
    "is_Available": true,
    "createdAt": "2026-01-13T12:00:00.000Z"
  }
}
```

---

#### Get Single Meal

Retrieve details of a specific meal.

**Endpoint:** `GET /mess/:messid/meals/:mealId`

**Authentication:** None (Public)

**Success Response (200):**
```json
{
  "meal": {
    "_id": "648d1e2f3g4h5i6j7k8l9m0n",
    "messId": "648c1d2e3f4g5h6i7j8k9l0m",
    "name": "Paneer Butter Masala Thali",
    "mealType": "lunch",
    "is_Veg": true,
    "price": 120,
    "is_Available": true
  }
}
```

---

#### Update Meal

Modify meal information.

**Endpoint:** `PUT /mess/:messid/meals/:mealId`

**Authentication:** Required (OWNER role)

**Request Body:**
```json
{
  "price": 150,
  "is_Available": false,
  "description": "Updated description"
}
```

**Success Response (200):**
```json
{
  "meal": {
    "_id": "648d1e2f3g4h5i6j7k8l9m0n",
    "price": 150,
    "is_Available": false,
    "updatedAt": "2026-01-13T13:00:00.000Z"
  }
}
```

---

#### Delete Meal

Remove a meal from the catalog.

**Endpoint:** `DELETE /mess/:messid/meals/:mealId`

**Authentication:** Required (OWNER role)

**Success Response (200):**
```json
{
  "meal": {
    "_id": "648d1e2f3g4h5i6j7k8l9m0n",
    "name": "Paneer Butter Masala Thali"
  }
}
```

---

## Rate Limiting

Currently not implemented. Planned for future releases.

## Pagination

Currently not implemented. All list endpoints return complete results. Pagination planned for future releases.

## Filtering & Sorting

Currently not implemented. Advanced filtering and sorting planned for future releases.

---

## Postman Collection

Import this URL into Postman for easy API testing:

```
Coming soon
```

---

## Support

For API support and questions:
- Email: [your-email@example.com]
- GitHub Issues: [Repository Issues](https://github.com/Akshay02-cmd/Mama-s-kitchen-backend/issues)

---

**Last Updated:** January 13, 2026
