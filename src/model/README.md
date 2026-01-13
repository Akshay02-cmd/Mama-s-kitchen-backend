# Models Module

Mongoose schemas and models defining the data structure for MongoDB collections.

## Overview

Models represent the application's data layer and define:
- Collection schemas
- Data validation rules
- Document methods
- Virtual properties
- Pre/post middleware hooks

## Files

### user.model.js
Core user authentication and account information.

**Collection:** `users`

**Schema Fields:**
- `role`: String - CUSTOMER or OWNER (required)
- `name`: String - User's full name (3-30 chars)
- `email`: String - Unique email address
- `password`: String - Hashed password (min 6 chars)
- `createdAt`: Date - Account creation timestamp

**Methods:**
- `createJWT()`: Generates JWT token with user payload
- `comparePassword(password)`: Compares plain text with hashed password

**Hooks:**
- `pre('save')`: Auto-hashes password before saving

**Usage:**
```javascript
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "CUSTOMER"
});

const token = user.createJWT();
const isValid = await user.comparePassword("password123");
```

### CustomerProfile.model.js
Extended profile information for customers.

**Collection:** `customers`

**Schema Fields:**
- `userId`: ObjectId - Reference to User (unique)
- `phone`: String - 10-digit Indian phone number
- `address`: String - Delivery address (10-300 chars)
- `isProfileCompleted`: Boolean - Profile completion status
- `timestamps`: Auto-added createdAt and updatedAt

**Validation:**
- Phone: Must match Indian mobile pattern `[6-9]XXXXXXXXX`
- One profile per user (unique userId)

**Usage:**
```javascript
const profile = await Customer.create({
  userId: "648a1b2c3d4e5f6g7h8i9j0k",
  phone: "9876543210",
  address: "123 Main St, Nashik"
});
```

### OwnerProfile.model.js
Extended profile information for mess owners.

**Collection:** `owners`

**Schema Fields:**
- `userId`: ObjectId - Reference to User (unique)
- `phone`: String - 10-digit Indian phone number
- `address`: String - Business address (10-300 chars)
- `isProfileCompleted`: Boolean - Profile completion status
- `timestamps`: Auto-added createdAt and updatedAt

**Validation:**
- Same phone validation as CustomerProfile
- One profile per user

**Usage:**
```javascript
const ownerProfile = await Owner.create({
  userId: "648a1b2c3d4e5f6g7h8i9j0k",
  phone: "9876543210",
  address: "456 Food Street, Nashik"
});
```

### Mess.model.js
Mess/catering service information.

**Collection:** `messes`

**Schema Fields:**
- `ownerId`: ObjectId - Reference to User (unique)
- `name`: String - Mess name (3-100 chars)
- `area`: String - Location area (3-100 chars)
- `phone`: String - Contact number
- `address`: String - Full address (10-300 chars)
- `description`: String - Mess description (10-500 chars)
- `is_Active`: Boolean - Active/inactive status
- `timestamps`: Auto-added createdAt and updatedAt

**Constraints:**
- One mess per owner (unique ownerId)
- Phone validation

**Usage:**
```javascript
const mess = await Mess.create({
  ownerId: "648a1b2c3d4e5f6g7h8i9j0k",
  name: "Mama's Kitchen",
  area: "Panchavati",
  phone: "9876543210",
  address: "123 Food Street",
  description: "Homemade authentic meals"
});
```

### Meal.model.js
Individual meal items within a mess.

**Collection:** `meals`

**Schema Fields:**
- `messId`: ObjectId - Reference to Mess (required)
- `name`: String - Meal name (3-100 chars)
- `mealType`: String - breakfast, lunch, dinner, or snack
- `is_Veg`: Boolean - Vegetarian flag
- `description`: String - Meal description (10-500 chars)
- `price`: Number - Price in rupees (min 0)
- `is_Available`: Boolean - Availability status
- `timestamps`: Auto-added createdAt and updatedAt

**Meal Types:**
- `breakfast`: Morning meals
- `lunch`: Afternoon meals
- `dinner`: Evening meals
- `snack`: Light snacks

**Usage:**
```javascript
const meal = await Meal.create({
  messId: "648a1b2c3d4e5f6g7h8i9j0k",
  name: "Paneer Butter Masala Thali",
  mealType: "lunch",
  is_Veg: true,
  description: "Delicious paneer with roti and rice",
  price: 120,
  is_Available: true
});
```

## Relationships

```
User (1) ──→ (1) CustomerProfile
User (1) ──→ (1) OwnerProfile
User (1) ──→ (1) Mess
Mess (1) ──→ (N) Meal
```

## Common Patterns

### Finding with Population
```javascript
// Get mess with owner details
const mess = await Mess.findById(messId)
  .populate('ownerId', 'name email');

// Get meal with mess details
const meal = await Meal.findById(mealId)
  .populate('messId', 'name area');
```

### Updating Documents
```javascript
const updatedMeal = await Meal.findByIdAndUpdate(
  mealId,
  { price: 150, is_Available: false },
  { new: true, runValidators: true }
);
```

### Querying with Conditions
```javascript
// Get all vegetarian lunch meals
const vegLunchMeals = await Meal.find({
  mealType: 'lunch',
  is_Veg: true,
  is_Available: true
});
```

## Validation Rules

### Email Validation
```javascript
match: [/.+@.+\..+/, "Please enter a valid email address"]
```

### Phone Validation
```javascript
match: [/^[6-9]\d{9}$/, "Invalid phone number"]
```

### String Length
```javascript
minlength: 3,
maxlength: 100
```

### Number Range
```javascript
min: 0  // No negative prices
```

## Best Practices

1. **Always use validators**
   ```javascript
   { new: true, runValidators: true }
   ```

2. **Index frequently queried fields**
   ```javascript
   email: { type: String, unique: true, index: true }
   ```

3. **Use refs for relationships**
   ```javascript
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
   ```

4. **Enable timestamps**
   ```javascript
   { timestamps: true }
   ```

## Future Enhancements

- [ ] Add indexes for performance
- [ ] Implement virtual properties
- [ ] Add pre/post hooks for business logic
- [ ] Create compound indexes
- [ ] Add text search indexes
- [ ] Implement soft delete functionality
- [ ] Add audit trail fields
- [ ] Create model-level validation methods
- [ ] Add geospatial indexing for location
- [ ] Implement versioning for documents
