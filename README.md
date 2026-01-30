# 🍽️ Mama's Kitchen - Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v9+-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

**Mama's Kitchen** is a comprehensive meal ordering platform that connects customers with local home-based caterers and mess services in Nashik, India. This repository contains the RESTful API backend built with Node.js, Express, and MongoDB.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Error Handling](#-error-handling)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Current Implementation

- ✅ **User Authentication**: JWT-based authentication with role-based access control
- ✅ **Role Management**: Support for CUSTOMER and OWNER user roles
- ✅ **Profile Management**: Separate profiles for customers and mess owners
- ✅ **Mess Management**: CRUD operations for mess/catering services
- ✅ **Meal Management**: Complete meal catalog with pricing and availability
- ✅ **Data Validation**: Input validation using Joi schemas
- ✅ **Secure Password Storage**: Bcrypt password hashing
- ✅ **Cookie & Token Auth**: Supports both cookie and bearer token authentication

### Planned Features

- 🔜 **Payment Integration**: Razorpay payment gateway
- 🔜 **Image Upload**: Meal and mess image management
- 🔜 **Search & Filters**: Advanced search and filtering capabilities
- 🔜 **Real-time Notifications**: Order status updates
- 🔜 **Email Services**: Email verification and notifications

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | Runtime environment |
| **Express.js** | v5.2.1 | Web framework |
| **MongoDB** | v9+ | Database |
| **Mongoose** | v9.1.1 | ODM for MongoDB |
| **JWT** | v9.0.3 | Authentication tokens |
| **Bcrypt.js** | v3.0.3 | Password hashing |
| **Joi** | v18.0.2 | Data validation |
| **http-status-codes** | v2.3.0 | HTTP status constants |
| **dotenv** | v17.2.3 | Environment configuration |

---

## 📁 Project Structure

```
Mama-s-kitchen-backend/
│
├── src/
│   ├── config/              # Configuration files
│   │   └── db.config.js     # Database connection setup
│   │
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   ├── meal.controller.js
│   │   ├── mess.controller.js
│   │   └── profile.contorllers.js
│   │
│   ├── errors/              # Custom error classes
│   │   ├── BadRequestError.js
│   │   ├── CutomeAPIError.js
│   │   ├── ForbiddenError.js
│   │   ├── NotFoundError.js
│   │   ├── UnauthorizedError.js
│   │   └── index.js
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── authorizeRoles.middelware.js
│   │   └── validator.middelware.js
│   │
│   ├── model/               # Mongoose models
│   │   ├── user.model.js
│   │   ├── CustomerProfile.model.js
│   │   ├── OwnerProfile.model.js
│   │   ├── Mess.model.js
│   │   └── Meal.model.js
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── mess.routes.js
│   │   └── profile.routes.js
│   │
│   ├── validators/          # Joi validation schemas
│   │   ├── auth.validators.js
│   │   ├── meal.validator.js
│   │   └── profile.validators.js
│   │
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
│
├── .env                     # Environment variables (not in repo)
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **MongoDB** v6.0 or higher (local or Atlas)
- **npm** v9.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshay02-cmd/Mama-s-kitchen-backend.git
   cd Mama-s-kitchen-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # If using MongoDB Atlas, ensure your connection string is in .env
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm start
   
   # Production mode
   node src/server.js
   ```

6. **Verify the server is running**
   ```bash
   curl http://localhost:5000
   # Response: "Welcome to Mama's Kitchen API"
   ```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/mamas-kitchen
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mamas-kitchen

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_LIFETIME=30d

# Application Settings
BCRYPT_SALT_ROUNDS=10
```

### Security Notes
- **Never commit `.env` to version control**
- Use strong, random JWT_SECRET in production
- Keep MongoDB credentials secure
- Use MongoDB Atlas or secure your local MongoDB instance

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"  // or "OWNER"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

### Profile Endpoints

#### Create Customer Profile
```http
POST /profile/customer
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "9876543210",
  "address": "123 Main Street, Nashik, Maharashtra"
}
```

#### Get Customer Profile
```http
GET /profile/customer
Authorization: Bearer <token>
```

#### Update Customer Profile
```http
PUT /profile/customer
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "9876543211",
  "address": "456 New Street, Nashik"
}
```

#### Owner Profile Endpoints
Similar to customer endpoints but use `/profile/owner`

### Mess Endpoints

#### Get All Messes
```http
GET /mess
```

#### Create Mess (Owner only)
```http
POST /mess
Authorization: Bearer <token>
Content-Type: application/json

{
  "messName": "Mama's Kitchen Nashik",
  "area": "Panchavati",
  "phone": "9876543210",
  "address": "123 Food Street, Nashik",
  "description": "Authentic homemade meals with love"
}
```

#### Get Single Mess
```http
GET /mess/:messid
```

#### Update Mess (Owner only)
```http
PUT /mess/:messid
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Mess (Owner only)
```http
DELETE /mess/:messid
Authorization: Bearer <token>
```

### Meal Endpoints

#### Get All Meals for a Mess
```http
GET /mess/:messid/meals
```

#### Create Meal (Owner only)
```http
POST /mess/:messid/meals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Paneer Butter Masala Thali",
  "mealType": "lunch",  // breakfast, lunch, dinner, snack
  "is_Veg": true,
  "description": "Delicious paneer curry with roti, rice, and salad",
  "price": 120,
  "is_Available": true
}
```

#### Get Single Meal
```http
GET /mess/:messid/meals/:mealId
```

#### Update Meal (Owner only)
```http
PUT /mess/:messid/meals/:mealId
Authorization: Bearer <token>
```

#### Delete Meal (Owner only)
```http
DELETE /mess/:messid/meals/:mealId
Authorization: Bearer <token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Validation errors
}
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (CUSTOMER | OWNER),
  createdAt: Date
}
```

### CustomerProfile Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  phone: String,
  address: String,
  isProfileCompleted: Boolean,
  timestamps: true
}
```

### OwnerProfile Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  phone: String,
  address: String,
  isProfileCompleted: Boolean,
  timestamps: true
}
```

### Mess Collection
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: User),
  name: String,
  area: String,
  phone: String,
  address: String,
  description: String,
  is_Active: Boolean,
  timestamps: true
}
```

### Meal Collection
```javascript
{
  _id: ObjectId,
  messId: ObjectId (ref: Mess),
  name: String,
  mealType: String (breakfast | lunch | dinner | snack),
  is_Veg: Boolean,
  description: String,
  price: Number,
  is_Available: Boolean,
  timestamps: true
}
```

---

## 🔒 Authentication & Authorization

### JWT Token Structure
```javascript
{
  userId: "user_id_from_database",
  name: "User Name",
  role: "CUSTOMER" | "OWNER"
}
```

### Authentication Methods

1. **Cookie-based** (Default)
   - Token stored in httpOnly cookie
   - Automatically sent with requests

2. **Bearer Token** (Alternative)
   ```http
   Authorization: Bearer <your-jwt-token>
   ```

### Protected Routes

- Customer-only routes: `/profile/customer/*`
- Owner-only routes: `/profile/owner/*`, mess creation/modification, meal creation/modification
- Public routes: Authentication endpoints, viewing messes and meals

---

## ⚠️ Error Handling

### Custom Error Classes

- **BadRequestError** (400): Invalid request data
- **UnauthorizedError** (401): Authentication failure
- **ForbiddenError** (403): Insufficient permissions
- **NotFoundError** (404): Resource not found

### Error Response Format
```json
{
  "success": false,
  "message": "Detailed error message",
  "statusCode": 400
}
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server with auto-reload
npm start

# Start production server
node src/server.js

# Run tests (not yet implemented)
npm test
```

### Code Style Guidelines

- Use ES6+ features (async/await, arrow functions, destructuring)
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)
- Add JSDoc comments for all functions
- Keep functions small and focused
- Use meaningful variable and function names

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Description"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

---

## 🧪 Testing

Testing infrastructure is planned for future releases. Recommended tools:

- **Jest**: Unit testing framework
- **Supertest**: HTTP assertions
- **MongoDB Memory Server**: In-memory database for testing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when testing is set up)
5. Ensure all tests pass
6. Submit a pull request

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👥 Authors

- **Akshay Patil** - *Initial work* - [@Akshay02-cmd](https://github.com/Akshay02-cmd)
- **TechRedy IT Solutions** - *Development Partner*

---

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- All contributors and testers

---

## 📞 Support

For support, email: [akshaydpatil1646@gmail.com]

Project Link: [https://github.com/Akshay02-cmd/Mama-s-kitchen-backend](https://github.com/Akshay02-cmd/Mama-s-kitchen-backend)

---

**Made with ❤️ in Nashik, India**
