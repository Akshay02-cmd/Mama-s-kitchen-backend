# Changelog

All notable changes to the Mama's Kitchen Backend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Order management system
- Payment gateway integration (Razorpay)
- Email service (Nodemailer)
- Image upload functionality (Multer/Cloudinary)
- Search and filtering capabilities
- Reviews and ratings system
- Pagination for list endpoints
- Rate limiting middleware
- CORS configuration
- API documentation with Swagger
- Automated testing (Jest + Supertest)
- WebSocket for real-time notifications

## [1.0.0] - 2026-01-13

### Added
- Complete authentication system with JWT
  - User registration endpoint
  - User login endpoint
  - Password hashing with bcrypt
  - JWT token generation and verification
  - Cookie and Bearer token support
- User model with role-based system (CUSTOMER, OWNER)
- Customer profile management
  - Create customer profile
  - Read customer profile
  - Update customer profile
- Owner profile management
  - Create owner profile
  - Read owner profile
  - Update owner profile
- Mess management system
  - Create mess (Owner only)
  - Read all messes (Public)
  - Read single mess (Public)
  - Update mess (Owner only)
  - Delete mess (Owner only)
- Meal catalog management
  - Create meal (Owner only)
  - Read all meals (Public)
  - Read single meal (Public)
  - Update meal (Owner only)
  - Delete meal (Owner only)
- Middleware stack
  - Authentication middleware (JWT verification)
  - Authorization middleware (Role-based access control)
  - Validation middleware (Joi schemas)
- Custom error handling
  - BadRequestError (400)
  - UnauthorizedError (401)
  - ForbiddenError (403)
  - NotFoundError (404)
  - CustomAPIError (Base class)
- Joi validation schemas
  - Auth validation (register, login)
  - Profile validation (customer, owner)
  - Mess validation (create, update)
  - Meal validation (create, update)
- MongoDB integration with Mongoose
  - User collection
  - Customer profile collection
  - Owner profile collection
  - Mess collection
  - Meal collection
- RESTful API structure
  - /auth routes
  - /profile routes
  - /mess routes
- Comprehensive documentation
  - Main README with setup instructions
  - API documentation with all endpoints
  - Architecture documentation
  - Contributing guidelines
  - README for each module folder
  - JSDoc comments throughout codebase
- Environment configuration
  - .env.example template
  - Environment variable validation
- Express application setup
  - JSON body parsing
  - Cookie parsing
  - Route organization
  - 404 handler

### Fixed
- Critical bug: Missing `await` keywords in meal controller database operations
- Critical bug: Missing `await` keywords in mess controller database operations
- Critical bug: Mess routes not registered in app.js
- Phone regex validation pattern (missing backslash in `/^[6-9]d{9}$/`)
- Incorrect destructuring in createMess controller (`req.user.userId` → `req.user`)
- `getallMeals` returning hardcoded string instead of actual data

### Changed
- Improved error handling consistency across controllers
- Enhanced security with httpOnly cookies
- Standardized response format across all endpoints

### Security
- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Role-based access control (RBAC)
- Input validation with Joi
- Mongoose schema validation
- httpOnly cookies for token storage

## [0.1.0] - 2026-01-10

### Added
- Initial project setup
- Basic Express server configuration
- MongoDB connection setup
- Project structure creation
- Package.json with dependencies
- Git repository initialization

---

## Version History

- **1.0.0** (2026-01-13) - Production-ready release with full CRUD operations
- **0.1.0** (2026-01-10) - Initial setup

---

## Notes

### Breaking Changes
None yet (first major release)

### Deprecations
None

### Known Issues
- [ ] No global error handler middleware
- [ ] No pagination on list endpoints
- [ ] No search/filter functionality
- [ ] Order system not implemented
- [ ] Payment integration missing
- [ ] Email service not configured
- [ ] Image upload not available
- [ ] No automated tests
- [ ] Missing API rate limiting
- [ ] No CORS configuration
- [ ] Typo in filename: "contorllers" should be "controllers"
- [ ] Typo in filename: "middelware" should be "middleware"
- [ ] Typo in filename: "CutomeAPIError" should be "CustomAPIError"

### Migration Guide
Not applicable (first release)

---

**For questions or issues, please visit:** https://github.com/Akshay02-cmd/Mama-s-kitchen-backend/issues
