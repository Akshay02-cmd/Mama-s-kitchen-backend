# Validators Module

Joi validation schemas for request data validation.

## Overview

Validators use Joi to define schema rules that ensure incoming request data meets requirements before processing.

## Files

### auth.validators.js
Validation schemas for authentication endpoints.

**RegisterSchema**
```javascript
{
  role: joi.string().valid("CUSTOMER", "OWNER"),
  name: joi.string().min(3).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required()
}
```

**Rules:**
- `role`: Optional, must be CUSTOMER or OWNER
- `name`: 3-50 characters, required
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required

**LoginSchema**
```javascript
{
  role: joi.string().valid("CUSTOMER", "OWNER").required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required()
}
```

**Usage:**
```javascript
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

### profile.validators.js
Validation schemas for profile and mess management.

**CustomerSchema**
```javascript
{
  userId: objectIdSchema,  // 24-char hex string
  phone: /^[6-9]d{9}$/,   // Indian mobile
  address: 10-300 chars, required
}
```

**OwnerSchema**
```javascript
{
  userId: objectIdSchema,
  phone: /^[6-9]d{9}$/,
  address: 10-300 chars, required
}
```

**UpdateProfileSchema**
```javascript
{
  name: 3-100 chars, optional,
  phone: /^[6-9]d{9}$/, optional,
  address: 10-300 chars, optional,
  is_Active: boolean, optional
}
```

**MessSchema**
```javascript
{
  ownerId: objectIdSchema,
  name: 3-100 chars, required,
  area: 3-100 chars, required,
  phone: /^[6-9]d{9}$/, required,
  address: 10-300 chars, required,
  description: 10-500 chars, required,
  is_Active: boolean, required
}
```

**UpdateMessSchema**
```javascript
{
  name: 3-100 chars, optional,
  phone: /^[6-9]d{9}$/, optional,
  address: 10-300 chars, optional,
  area: 3-100 chars, optional,
  description: 10-500 chars, optional,
  is_Active: boolean, optional
}
```

**Usage:**
```javascript
POST /profile/customer
{
  "phone": "9876543210",
  "address": "123 Main Street, Nashik"
}
```

### meal.validator.js
Validation schemas for meal operations.

**MealSchema**
```javascript
{
  messId: objectIdSchema,
  name: 3-100 chars, required,
  mealType: ["breakfast", "lunch", "dinner", "snack"], required,
  is_Veg: boolean, required,
  description: 10-500 chars, required,
  price: number >= 1, required,
  is_Available: boolean, required
}
```

**UpdateMealSchema**
```javascript
{
  name: 3-100 chars, optional,
  description: 10-500 chars, optional,
  price: number >= 1, optional,
  is_Available: boolean, optional
}
```

**Usage:**
```javascript
POST /mess/648a.../meals
{
  "name": "Paneer Butter Masala",
  "mealType": "lunch",
  "is_Veg": true,
  "description": "Delicious paneer curry with rice",
  "price": 120,
  "is_Available": true
}
```

## Validation Rules

### String Rules
```javascript
.min(3)           // Minimum length
.max(100)         // Maximum length
.required()       // Cannot be empty
.email()          // Valid email format
.valid("A", "B")  // Must be one of these
```

### Number Rules
```javascript
.min(1)           // Minimum value
.max(1000)        // Maximum value
.required()       // Cannot be null
```

### Boolean Rules
```javascript
.required()       // Must be true or false
```

### Pattern Rules
```javascript
.pattern(/^[6-9]d{9}$/)  // Regex match (note: needs fixing to \d)
```

### ObjectId Rules
```javascript
.string().length(24).hex().required()  // MongoDB ObjectId
```

## Validation Error Response

When validation fails:
```javascript
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "\"email\" must be a valid email",
    "\"password\" length must be at least 6 characters long",
    "\"phone\" with value \"123\" fails to match the required pattern"
  ]
}
```

## Common Validation Patterns

### Required Field
```javascript
name: Joi.string().min(3).max(50).required()
```

### Optional Field
```javascript
description: Joi.string().min(10).max(500)  // No .required()
```

### Enum Values
```javascript
role: Joi.string().valid("CUSTOMER", "OWNER").required()
```

### Phone Number (Indian)
```javascript
phone: Joi.string().pattern(/^[6-9]\d{9}$/).required()
```

### Email
```javascript
email: Joi.string().email().required()
```

### ObjectId
```javascript
const objectIdSchema = Joi.string().length(24).hex().required();
messId: objectIdSchema
```

## Validation Options

### abortEarly
```javascript
schema.validate(data, { abortEarly: false })
```
- `true`: Stop at first error
- `false`: Return all errors (used in validator middleware)

### stripUnknown
```javascript
schema.validate(data, { stripUnknown: true })
```
- Removes fields not in schema

## Best Practices

1. **Use consistent patterns**
   ```javascript
   // Good - reusable pattern
   const phonePattern = /^[6-9]\d{9}$/;
   phone: Joi.string().pattern(phonePattern).required()
   ```

2. **Separate create and update schemas**
   ```javascript
   // Create - all required
   export const MealSchema = Joi.object({ ... });
   
   // Update - all optional
   export const UpdateMealSchema = Joi.object({ ... });
   ```

3. **Don't validate server-set fields**
   ```javascript
   // Bad - userId comes from JWT, not request body
   userId: objectIdSchema
   
   // Good - exclude server-set fields
   // (userId comes from req.user)
   ```

4. **Provide helpful error messages**
   ```javascript
   price: Joi.number().min(1).required()
     .messages({
       'number.min': 'Price must be at least 1 rupee',
       'any.required': 'Price is required'
     })
   ```

## Security Considerations

1. **Don't accept IDs from request body**
   - User IDs should come from JWT
   - Prevents privilege escalation

2. **Validate nested objects**
   ```javascript
   address: Joi.object({
     street: Joi.string().required(),
     city: Joi.string().required()
   })
   ```

3. **Sanitize strings**
   ```javascript
   name: Joi.string().trim().lowercase()
   ```

4. **Limit string lengths**
   - Prevents buffer overflow attacks
   - Protects database storage

## Future Enhancements

- [ ] Fix phone regex patterns (missing backslash before \d)
- [ ] Add custom error messages
- [ ] Create reusable validation patterns
- [ ] Add cross-field validation
- [ ] Implement conditional validation
- [ ] Add custom validators
- [ ] Create validation test suite
- [ ] Add sanitization rules
- [ ] Implement schema versioning
- [ ] Add internationalized error messages
