# Authentication & Authorization

## Overview

Mama's Kitchen implements a comprehensive authentication and authorization system using **JWT (JSON Web Tokens)** and **Role-Based Access Control (RBAC)**.

## Authentication System

### Technology Stack

- **JWT (jsonwebtoken)**: Token generation and verification
- **Bcrypt.js**: Password hashing and comparison
- **Cookie-parser**: httpOnly cookie handling
- **Custom Middleware**: Token extraction and validation

### Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. POST /auth/register or /auth/login
       │    { email, password, role }
       ▼
┌──────────────────────┐
│  Auth Controller     │
│  - Validate input    │
│  - Call auth service │
└──────┬───────────────┘
       │ 2. Service processes request
       ▼
┌──────────────────────┐
│   Auth Service       │
│ - Find/Create user   │
│ - Verify password    │
│ - Generate JWT       │
└──────┬───────────────┘
       │ 3. Return user + token
       ▼
┌──────────────────────┐
│  Auth Controller     │
│ - Set httpOnly cookie│
│ - Return JSON        │
└──────┬───────────────┘
       │ 4. Response with token
       ▼
┌──────────────────────┐
│      Client          │
│ - Store in cookie    │
│ - OR localStorage    │
└──────┬───────────────┘
       │ 5. Subsequent requests include token
       ▼
┌──────────────────────┐
│  Auth Middleware     │
│ - Extract token      │
│ - Verify signature   │
│ - Decode payload     │
│ - Attach req.user    │
└──────────────────────┘
```

## JWT Token Structure

### Token Payload

```javascript
{
  userId: "507f1f77bcf86cd799439011",  // MongoDB ObjectId
  name: "John Doe",                    // User's name
  role: "CUSTOMER",                    // User role (CUSTOMER or OWNER)
  iat: 1675950000,                     // Issued at (timestamp)
  exp: 1678628400                      // Expiration (timestamp)
}
```

### Token Generation

**File**: `src/model/user.model.js`

```javascript
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { 
      userId: this._id, 
      name: this.name, 
      role: this.role 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpirationMinutes || "30d" }
  );
};
```

### Token Configuration

**Environment Variables**:
```env
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_ACCESS_EXPIRATION_MINUTES=43200  # 30 days
```

### Token Expiration

- **Default**: 30 days (43,200 minutes)
- **Configurable**: Via environment variable
- **Automatic**: Token expires and requires re-authentication

## Password Security

### Password Hashing

**Algorithm**: Bcrypt with salt rounds

**Implementation**:

```javascript
// Pre-save middleware in user.model.js
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

**Features**:
- **Salt Rounds**: 10 (configurable)
- **Unique Salt**: Generated for each password
- **One-way Hashing**: Cannot be reversed
- **Automatic**: Happens before saving user

### Password Comparison

```javascript
UserSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};
```

### Password Requirements

- **Minimum Length**: 6 characters
- **Future Enhancement**: 
  - Uppercase + Lowercase
  - Numbers required
  - Special characters
  - Maximum length limit

## Authentication Methods

### 1. Cookie-Based Authentication

**Implementation**:

```javascript
// Set cookie in response
res.cookie("token", token, {
  httpOnly: true,        // Prevents XSS attacks
  secure: false,         // Set to true in production (HTTPS)
  sameSite: 'lax',      // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
});
```

**Middleware Extraction**:

```javascript
const cookieToken = req.cookies?.token;
```

**Advantages**:
- Automatic inclusion in requests
- HttpOnly prevents JavaScript access
- Built-in CSRF protection
- Better security for web apps

**Disadvantages**:
- Doesn't work for mobile apps
- Domain-specific

### 2. Bearer Token Authentication

**Implementation**:

```javascript
// Client sets header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Middleware Extraction**:

```javascript
const authHeader = req.headers.authorization;
if (authHeader && authHeader.startsWith("Bearer ")) {
  token = authHeader.split(" ")[1];
}
```

**Advantages**:
- Works with mobile apps
- Cross-domain support
- RESTful standard
- Explicit token management

**Disadvantages**:
- Vulnerable to XSS if stored in localStorage
- Must be manually included in requests

### 3. Dual Support

The system supports BOTH methods simultaneously:

```javascript
// Priority: Cookie first, then Bearer token
const auth = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;

  let token;
  if (cookieToken) {
    token = cookieToken;
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new UnauthorizedError("Authentication invalid");
  }

  // ... verify token
};
```

## Authorization System

### Role-Based Access Control (RBAC)

**Roles**:
1. **CUSTOMER** - Regular users who order meals
2. **OWNER** - Mess/restaurant owners
3. **ADMIN** - System administrators (future)

### Role Definitions

**File**: `src/config/roles.js`

```javascript
const allRoles = {
  customer: [
    "createContactUs",
    "getallMeals",
    "getMeal"
  ],
  owner: [
    "getMess",
    "createMess",
    "updateMess",
    "deleteMess",
    "getallMeals",
    "createMeal",
    "updateMeal",
    "deleteMeal",
  ],
  admin: [
    "getallMesses",
    "getMess",
    "deleteAllContactUs",
    "getAllContactUs",
    "getContactUsById",
    "GroupContactUsByUser",
    "deleteContactUs",
    "getallMeals",
  ],
  user: [
    "deleteContactUs",
    "getContactUs",
    "groupContactUsByUser",
    "deleteAllContactUs",
    "getAllContactUs",
  ]
};
```

### Authorization Middleware

**File**: `src/middleware/authorizeRoles.middelware.js`

**Simple Role Check**:

```javascript
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Access denied");
    }

    next();
  };
};
```

**Usage in Routes**:

```javascript
router.post('/mess', 
  auth,                           // Verify authentication
  authorizeRoles('OWNER'),       // Check role
  validate(messSchema),          // Validate input
  messController.create          // Handle request
);
```

### Resource Ownership Verification

**Pattern**: Verify user owns the resource they're modifying

**Example - Update Mess**:

```javascript
const updateMess = async (req, res) => {
  const mess = await Mess.findById(req.params.id);
  
  if (!mess) {
    throw new NotFoundError("Mess not found");
  }

  // Verify ownership
  if (mess.ownerId.toString() !== req.user.userId) {
    throw new ForbiddenError("You can only update your own mess");
  }

  // Proceed with update
  const updatedMess = await Mess.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, mess: updatedMess });
};
```

## Protected Routes

### Route Protection Levels

#### 1. Public Routes
No authentication required

```javascript
// Anyone can access
router.get('/mess', messController.getAll);
router.get('/menu', mealController.getAll);
```

#### 2. Authenticated Routes
Any logged-in user

```javascript
// Must be logged in
router.get('/profile/customer', 
  auth,                    // Authentication only
  profileController.get
);
```

#### 3. Role-Restricted Routes
Specific roles only

```javascript
// Only OWNER role
router.post('/mess', 
  auth,
  authorizeRoles('OWNER'),
  messController.create
);

// Only CUSTOMER role
router.post('/orders',
  auth,
  authorizeRoles('CUSTOMER'),
  orderController.create
);
```

#### 4. Resource-Owned Routes
Must own the resource

```javascript
// Must own the mess
router.put('/mess/:id',
  auth,
  authorizeRoles('OWNER'),
  // Controller checks ownership
  messController.update
);
```

## Authentication Endpoints

### Register

**Endpoint**: `POST /auth/register`

**Process**:
1. Validate input (name, email, password, role)
2. Check email uniqueness
3. Hash password (automatic via pre-save hook)
4. Create user document
5. Generate JWT token
6. Set httpOnly cookie
7. Return user + token

### Login

**Endpoint**: `POST /auth/login`

**Process**:
1. Validate input (email, password, role)
2. Find user by email
3. Verify role matches
4. Compare password hash
5. Generate JWT token
6. Set httpOnly cookie
7. Return user + token

### Logout

**Endpoint**: `POST /auth/logout`

**Process**:
1. Clear httpOnly cookie (set to empty, expires immediately)
2. Return success message
3. Client should also clear localStorage token

## Error Handling

### Authentication Errors

**401 Unauthorized**:
- No token provided
- Invalid token signature
- Expired token
- Token payload malformed

```javascript
throw new UnauthorizedError("Authentication invalid");
```

### Authorization Errors

**403 Forbidden**:
- Insufficient role permissions
- Not resource owner
- Account suspended/inactive

```javascript
throw new ForbiddenError("Access denied");
```

### Login Errors

**400 Bad Request**:
- Invalid credentials
- Email not found
- Password mismatch
- Role mismatch

```javascript
throw new BadRequestError("Invalid credentials");
```

## Security Best Practices

### 1. Token Security

✅ **Implemented**:
- HttpOnly cookies prevent XSS
- Token expiration (30 days)
- Secure secret key generation
- Token signature verification

🔜 **Planned**:
- Refresh tokens for longer sessions
- Token blacklisting on logout
- Short-lived access tokens (15 min)
- 'secure' flag in production (HTTPS)

### 2. Password Security

✅ **Implemented**:
- Bcrypt hashing with salt
- Minimum length requirement
- Pre-save automatic hashing
- Constant-time comparison

🔜 **Planned**:
- Password complexity rules
- Password history (prevent reuse)
- Password reset functionality
- Account lockout after failed attempts

### 3. CORS Configuration

```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,                // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Input Validation

- Joi schema validation for all inputs
- Mongoose schema validation
- Email format verification
- Sanitization to prevent injection

## Advanced Features (Planned)

### 1. Refresh Tokens

```javascript
// Long-lived refresh token
{
  type: "refresh",
  userId: "...",
  exp: 90 * 24 * 60 * 60  // 90 days
}

// Short-lived access token
{
  type: "access",
  userId: "...",
  role: "...",
  exp: 15 * 60  // 15 minutes
}
```

### 2. Multi-Factor Authentication (MFA)

- SMS OTP verification
- Email verification
- Authenticator app support

### 3. Social Authentication

- Google OAuth
- Facebook Login
- Apple Sign In

### 4. Session Management

- Active session tracking
- Device management
- Force logout all devices
- Session activity logging

### 5. Password Reset

```
1. User requests password reset
2. Generate reset token (expires in 1 hour)
3. Send email with reset link
4. User clicks link, enters new password
5. Invalidate reset token
6. Log user in automatically
```

### 6. Email Verification

```
1. User registers
2. Generate verification token
3. Send verification email
4. User clicks link
5. Mark email as verified
6. Allow full account access
```

## Testing Authentication

### Manual Testing

**1. Register User**:
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "CUSTOMER"
  }'
```

**2. Login User**:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "CUSTOMER"
  }'
```

**3. Access Protected Route**:
```bash
curl -X GET http://localhost:5000/profile/customer \
  -H "Authorization: Bearer <your-token>"
```

### Automated Testing (Planned)

```javascript
describe('Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CUSTOMER'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should login existing user', async () => {
    // ... test implementation
  });

  it('should reject invalid credentials', async () => {
    // ... test implementation
  });
});
```

## Troubleshooting

### Common Issues

**Issue**: "Authentication invalid" error

**Solutions**:
- Verify token is being sent (cookie or header)
- Check token hasn't expired
- Ensure JWT_SECRET matches between token creation and verification
- Verify token format: `Bearer <token>`

**Issue**: "Access denied" error

**Solutions**:
- Verify user role matches required role
- Check user owns the resource (for ownership-based routes)
- Ensure authorization middleware is after auth middleware

**Issue**: Password not matching

**Solutions**:
- Verify password is being hashed before saving
- Check bcrypt compare function is being used
- Ensure password hasn't been double-hashed

**Issue**: CORS errors with cookies

**Solutions**:
- Set `credentials: true` in CORS config
- Match frontend origin in CORS config
- Use `withCredentials: true` in frontend axios

## Migration Guide

### From Session-Based to JWT

If migrating from session-based auth:

1. **Backend Changes**:
   - Remove express-session
   - Remove session store (Redis/MongoDB)
   - Implement JWT generation in user model
   - Create auth middleware for JWT verification
   - Update all protected routes

2. **Frontend Changes**:
   - Store token in localStorage or cookie
   - Include token in all API requests
   - Handle token expiration
   - Implement refresh logic

3. **Database Changes**:
   - Remove session collection
   - No schema changes required for users

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens signed and verified
- ✅ HttpOnly cookies for web
- ✅ Role-based access control
- ✅ Resource ownership verification
- ✅ Input validation on all endpoints
- ✅ CORS properly configured
- ⬜ Refresh token implementation
- ⬜ Rate limiting on auth endpoints
- ⬜ Account lockout after failed attempts
- ⬜ Password reset functionality
- ⬜ Email verification
- ⬜ Two-factor authentication
- ⬜ HTTPS enforced in production
