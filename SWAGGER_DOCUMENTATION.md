# Swagger API Documentation

This backend now includes interactive Swagger/OpenAPI documentation for all API endpoints.

## 📚 Accessing the Documentation

### Local Development
Once the server is running, visit:
```
http://localhost:5000/api-docs
```

### Production
```
https://api.mamaskitchen.com/api-docs
```

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:4000/api-docs
   ```

3. **Explore the API:**
   - Browse all available endpoints
   - View request/response schemas
   - Test endpoints directly from the browser

## 🔐 Authentication

The API uses JWT authentication. To test protected endpoints:

1. **Register/Login** using the authentication endpoints
2. **Copy the JWT token** from the response
3. **Click "Authorize"** button at the top of Swagger UI
4. **Enter:** `Bearer <your-token>`
5. **Click "Authorize"** to apply

Now you can test all protected endpoints!

## 📖 API Overview

### Available Endpoints

#### 🔑 Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

#### 👤 Profile Management
- `GET /profile/customer` - Get customer profile
- `POST /profile/customer` - Create customer profile
- `PUT /profile/customer` - Update customer profile
- `GET /profile/owner` - Get owner profile
- `POST /profile/owner` - Create owner profile
- `PUT /profile/owner` - Update owner profile

#### 🏪 Mess Management
- `GET /mess` - Get all messes
- `POST /mess` - Create new mess (Owner only)
- `GET /mess/{id}` - Get mess by ID
- `PUT /mess/{id}` - Update mess (Owner only)
- `DELETE /mess/{id}` - Delete mess (Owner only)

#### 🍽️ Menu/Meals
- `GET /menu` - Get all meals
- `POST /menu` - Create new meal (Owner only)
- `GET /menu/{id}` - Get meal by ID
- `PUT /menu/{id}` - Update meal (Owner only)
- `DELETE /menu/{id}` - Delete meal (Owner only)

#### 📦 Orders
- `GET /orders` - Get all orders (filtered by role)
- `POST /orders` - Create new order (Customer only)
- `GET /orders/{id}` - Get order by ID
- `PUT /orders/{id}` - Update order status

#### ⭐ Reviews
- `GET /reviews` - Get all reviews
- `POST /reviews` - Create review (Customer only)
- `GET /reviews/{id}` - Get review by ID
- `PUT /reviews/{id}` - Update review
- `DELETE /reviews/{id}` - Delete review

#### 👥 Users
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID

#### 📧 Contact
- `POST /contacts` - Submit contact request
- `GET /contacts` - Get all contact requests (Admin only)

## 🎨 Features

- **Interactive Testing** - Test all endpoints directly from the browser
- **Schema Validation** - View request/response schemas
- **Authentication Support** - Built-in JWT token authentication
- **Filtering & Search** - Query parameters for filtering data
- **Role-based Access** - Clear indication of role requirements
- **Comprehensive Examples** - Sample requests and responses

## 📝 Making API Calls

### Example: Register a New User

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "CUSTOMER"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "CUSTOMER"
  }'
```

### Example: Get Profile (with token)

```bash
curl -X GET http://localhost:5000/profile/customer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Configuration

Swagger configuration is located in: `src/config/swagger.js`

API documentation annotations are in: `src/docs/api-docs.js`

## 📚 Additional Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

## 🤝 Contributing

When adding new endpoints, please update the Swagger documentation in `src/docs/api-docs.js` with appropriate JSDoc comments.

## 📞 Support

For issues or questions about the API, please contact the development team.

---

**Built with ❤️ using Express.js, MongoDB, and Swagger UI**
