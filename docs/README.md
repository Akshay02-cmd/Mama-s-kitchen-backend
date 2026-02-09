# Backend Documentation Index

Welcome to the Mama's Kitchen Backend documentation. This folder contains comprehensive documentation for the backend API.

## 📚 Documentation Files

### Architecture & Design

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete backend architecture overview
  - Layered architecture pattern
  - Directory structure
  - Design patterns used
  - Security measures
  - Scalability considerations

- **[DATABASE.md](./DATABASE.md)** - Database schema and design
  - MongoDB collections
  - Schema definitions
  - Relationships (ERD)
  - Indexes and optimization
  - Query patterns

### API Documentation

- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Complete API reference
  - All endpoints with examples
  - Request/response formats
  - Authentication requirements
  - Error responses
  - Status codes

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Authentication & authorization
  - JWT implementation
  - Password security
  - Role-based access control (RBAC)
  - Protected routes
  - Security best practices

### Interactive Documentation

- **Swagger UI**: http://localhost:5000/api-docs
  - Live API testing
  - Request/response schemas
  - Try endpoints directly

## 🚀 Quick Start

1. **New to the project?** Start with [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Need to use the API?** Check [API_ENDPOINTS.md](./API_ENDPOINTS.md)
3. **Working with database?** Read [DATABASE.md](./DATABASE.md)
4. **Implementing auth?** See [AUTHENTICATION.md](./AUTHENTICATION.md)

## 📖 Related Documentation

### Root Documentation
- [PROJECT_OVERVIEW.md](../../PROJECT_OVERVIEW.md) - Overall project information
- [SETUP.md](../../SETUP.md) - Installation and setup guide
- [USER_WORKFLOWS.md](../../USER_WORKFLOWS.md) - User journey documentation

### Frontend Documentation
- Navigate to `../Mama-s-kitchen-frontend/docs/` for frontend documentation

## 🔍 Quick Reference

### Authentication Headers

**Cookie-based**:
```
Cookie: token=<jwt-token>
```

**Bearer token**:
```
Authorization: Bearer <jwt-token>
```

### Response Format

**Success**:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://api.mamaskitchen.com` (planned)

## 🛠️ Development

### Starting the Server

```bash
# Development mode
npm start

# Production mode
npm run start:prod

# Debug mode
npm run dev
```

### Environment Variables

Required `.env` configuration:

```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/mamas-kitchen
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION_MINUTES=43200
NODE_ENV=development
```

## 📝 API Versioning

- **Current**: v1 (implicit, no prefix)
- **Future**: `/api/v2/...`

## 🔐 Security

- JWT token authentication
- Bcrypt password hashing (10 rounds)
- Role-based access control
- Input validation (Joi)
- CORS configuration
- Error sanitization

## 🧪 Testing

**Manual Testing**:
- Use Swagger UI: http://localhost:5000/api-docs
- Use Postman/Thunder Client
- Use curl commands

**Automated Testing** (Planned):
- Unit tests with Jest
- Integration tests
- E2E tests

## 📊 Database

**Connection**:
```
mongodb://localhost:27017/mamas-kitchen
```

**Collections**:
- users
- customerprofiles
- ownerprofiles
- messes
- meals
- orders
- reviews
- contactuses

## 🚦 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## 📞 Support

For questions or issues:
- Check relevant documentation file
- Review Swagger documentation
- Check GitHub issues
- Contact: your-email@example.com

## 🔄 Updates

**Last Updated**: February 9, 2026  
**Version**: 1.0.0

## 📋 Contributing

When adding new features:
1. Update relevant documentation
2. Update Swagger specs
3. Add examples to API documentation
4. Update this index if needed

---

**Note**: All documentation is maintained in markdown files. Code files should not contain extensive documentation - refer to these docs instead.
