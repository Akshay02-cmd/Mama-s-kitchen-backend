# Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone and install
git clone https://github.com/Akshay02-cmd/Mama-s-kitchen-backend.git
cd Mama-s-kitchen-backend
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Start server
npm start
# Server running at http://localhost:5000
```

---

## 🔑 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mamas-kitchen
JWT_SECRET=your-secret-key-here
JWT_LIFETIME=30d
```

---

## 📡 API Endpoints Cheat Sheet

### Authentication
```bash
POST   /auth/register    # Register new user
POST   /auth/login       # Login user
```

### Customer Profile
```bash
GET    /profile/customer      # Get profile (Auth: CUSTOMER)
POST   /profile/customer      # Create profile (Auth: CUSTOMER)
PUT    /profile/customer      # Update profile (Auth: CUSTOMER)
```

### Owner Profile
```bash
GET    /profile/owner         # Get profile (Auth: OWNER)
POST   /profile/owner         # Create profile (Auth: OWNER)
PUT    /profile/owner         # Update profile (Auth: OWNER)
```

### Messes
```bash
GET    /mess                  # List all messes (Public)
POST   /mess                  # Create mess (Auth: OWNER)
GET    /mess/:messid          # Get single mess (Public)
PUT    /mess/:messid          # Update mess (Auth: OWNER)
DELETE /mess/:messid          # Delete mess (Auth: OWNER)
```

### Meals
```bash
GET    /mess/:messid/meals              # List meals (Public)
POST   /mess/:messid/meals              # Create meal (Auth: OWNER)
GET    /mess/:messid/meals/:mealId      # Get meal (Public)
PUT    /mess/:messid/meals/:mealId      # Update meal (Auth: OWNER)
DELETE /mess/:messid/meals/:mealId      # Delete meal (Auth: OWNER)
```

---

## 💻 Common Commands

```bash
# Development
npm start                    # Start with nodemon
npm run dev                  # Start with inspector
npm run start:prod           # Production mode

# Testing
npm test                     # Run tests (not implemented)

# Database
mongod                       # Start local MongoDB

# Git
git pull upstream main       # Update from upstream
git push origin feature/xyz  # Push feature branch
```

---

## 🧪 Testing with cURL

### Register User
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

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "CUSTOMER"
  }'
```

### Create Profile (with token)
```bash
curl -X POST http://localhost:5000/profile/customer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phone": "9876543210",
    "address": "123 Main St, Nashik"
  }'
```

### Get All Messes
```bash
curl http://localhost:5000/mess
```

---

## 📦 Project Structure

```
src/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── errors/         # Custom error classes
├── middleware/     # Express middleware
├── model/          # Mongoose models
├── routes/         # API routes
├── validators/     # Joi schemas
├── app.js          # Express setup
└── server.js       # Entry point
```

---

## 🔐 Authentication Flow

```
1. Register/Login → Receive JWT token
2. Store token in cookie or localStorage
3. Send token in subsequent requests:
   - Cookie: Automatic
   - Header: Authorization: Bearer <token>
```

---

## 🎭 User Roles

| Role | Can Do |
|------|--------|
| CUSTOMER | View messes/meals, manage own profile |
| OWNER | Everything CUSTOMER can + manage own mess/meals |

---

## 🗄️ Database Collections

```
users          # Authentication
customers      # Customer profiles
owners         # Owner profiles
messes         # Mess/catering services
meals          # Meal catalog
```

---

## ⚡ Quick Troubleshooting

### Server won't start
```bash
# Check MongoDB is running
mongod --version

# Check port availability
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Check environment variables
cat .env
```

### Authentication fails
```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Check token expiration
# Default: 30 days
```

### Database connection fails
```bash
# Verify MONGO_URI
echo $MONGO_URI

# Test MongoDB connection
mongosh "mongodb://localhost:27017/mamas-kitchen"
```

---

## 🛠️ Development Tips

### Hot Reload
```bash
npm start  # Uses nodemon for auto-restart
```

### Debug Mode
```bash
npm run dev  # Starts with --inspect flag
# Open chrome://inspect in Chrome
```

### View Logs
```bash
# Server logs in terminal
# Future: Winston logger integration planned
```

---

## 📚 Documentation Links

- [Main README](README.md) - Complete setup guide
- [API Docs](API_DOCUMENTATION.md) - All endpoints with examples
- [Architecture](ARCHITECTURE.md) - System design
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Security](SECURITY.md) - Security policy
- [Changelog](CHANGELOG.md) - Version history

---

## 🔗 Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/) - Decode JWT tokens
- [Joi Docs](https://joi.dev/) - Validation
- [MongoDB Docs](https://docs.mongodb.com/)

---

## 📞 Get Help

- GitHub Issues: [Report Bug](https://github.com/Akshay02-cmd/Mama-s-kitchen-backend/issues)
- Email: your-email@example.com
- Maintainer: [@Akshay02-cmd](https://github.com/Akshay02-cmd)

---

**💡 Pro Tip:** Use Postman to test APIs. Import the collection for easier development!

**Last Updated:** January 13, 2026
