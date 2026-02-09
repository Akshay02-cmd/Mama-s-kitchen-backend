# Database Schema Documentation

## Overview

Mama's Kitchen uses **MongoDB** as its primary database with **Mongoose** as the ODM (Object Data Modeling) library. The database follows a document-oriented structure optimized for the meal ordering platform.

## Database Connection

**File**: `src/services/connectDB.js`

**Connection String**: 
```
mongodb://localhost:27017/mamas-kitchen
```

**Configuration**:
- Connection pooling enabled
- Auto-reconnection on failure
- Timestamps on all collections

## Collections

### 1. Users Collection

**Model**: `user.model.js`

**Purpose**: Core user authentication and role management

**Schema**:
```javascript
{
  role: String,           // "CUSTOMER" or "OWNER"
  name: String,          // Min: 3, Max: 30 characters
  email: String,         // Unique, lowercase, validated format
  password: String,      // Bcrypt hashed, Min: 6 characters
  createdAt: Date        // Auto-generated timestamp
}
```

**Indexes**:
- `email` (unique)
- `role`

**Methods**:
- `createJWT()` - Generates JWT token for authentication
- `comparePassword(userPassword)` - Compares plain text with hashed password

**Middleware**:
- **Pre-save**: Automatically hashes password before saving

**Validations**:
- Email must match valid email format
- Password minimum 6 characters
- Name between 3-30 characters
- Role must be "CUSTOMER" or "OWNER"

**Relationships**:
- 1:1 with CustomerProfile (if role is CUSTOMER)
- 1:1 with OwnerProfile (if role is OWNER)

---

### 2. Customer Profiles Collection

**Model**: `CustomerProfile.model.js`

**Purpose**: Customer-specific profile information

**Schema**:
```javascript
{
  userId: ObjectId,           // Reference to User
  phone: String,             // Indian mobile format (10 digits, starts with 6-9)
  address: String,           // Min: 10, Max: 300 characters
  dietaryPreferences: {
    is_Veg: Boolean,        // Vegetarian preference
    allergies: [String],    // List of allergies
    favoriteCuisines: [String]  // Preferred cuisines
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId` (unique)

**Validations**:
- Phone: Must match `/^[6-9]\d{9}$/` pattern
- Address: 10-300 characters

**Relationships**:
- Belongs to one User (userId)

---

### 3. Owner Profiles Collection

**Model**: `OwnerProfile.model.js`

**Purpose**: Owner-specific profile information

**Schema**:
```javascript
{
  userId: ObjectId,           // Reference to User
  businessName: String,      // Min: 3, Max: 100 characters
  phone: String,             // Indian mobile format
  address: String,           // Min: 10, Max: 300 characters
  gstin: String,             // GST Identification Number
  description: String,       // Min: 10, Max: 500 characters
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId` (unique)
- `gstin`

**Validations**:
- Phone: Must match `/^[6-9]\d{9}$/` pattern
- Business name: 3-100 characters
- Address: 10-300 characters
- Description: 10-500 characters

**Relationships**:
- Belongs to one User (userId)

---

### 4. Messes Collection

**Model**: `Mess.model.js`

**Purpose**: Restaurant/Mess/Caterer information

**Schema**:
```javascript
{
  ownerId: ObjectId,         // Reference to User (Owner)
  name: String,              // Min: 3, Max: 100 characters
  area: String,              // Location area, Min: 3, Max: 100
  phone: String,             // Indian mobile format
  address: String,           // Min: 10, Max: 300 characters
  description: String,       // Min: 10, Max: 500 characters
  is_Active: Boolean,        // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `ownerId`
- `area`
- `is_Active`

**Validations**:
- Name: 3-100 characters
- Area: 3-100 characters
- Phone: Must match `/^[6-9]\d{9}$/` pattern
- Address: 10-300 characters
- Description: 10-500 characters

**Relationships**:
- Belongs to one Owner (ownerId)
- Has many Meals (1:N)
- Has many Reviews (1:N)

---

### 5. Meals Collection

**Model**: `Meal.model.js`

**Purpose**: Individual meal/dish information

**Schema**:
```javascript
{
  messId: ObjectId,          // Reference to Mess
  name: String,              // Min: 3, Max: 100 characters
  mealType: String,          // "breakfast", "lunch", "dinner", "snack"
  is_Veg: Boolean,           // Vegetarian flag
  description: String,       // Min: 10, Max: 500 characters
  price: Number,             // Min: 0
  is_Available: Boolean,     // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `messId`
- `mealType`
- `is_Veg`
- `is_Available`

**Validations**:
- Name: 3-100 characters
- MealType: Must be one of ["breakfast", "lunch", "dinner", "snack"]
- Description: 10-500 characters
- Price: Must be >= 0

**Relationships**:
- Belongs to one Mess (messId)
- Referenced by many OrderItems (N:N through Order)
- Has many Reviews (1:N)

---

### 6. Orders Collection

**Model**: `order.model.js`

**Purpose**: Customer order management

**Schema**:
```javascript
{
  userId: ObjectId,          // Reference to User (Customer)
  orderItems: [{
    mealId: ObjectId,       // Reference to Meal
    quantity: Number,       // Min: 1
    price: Number           // Min: 0
  }],
  totalAmount: Number,       // Min: 0
  deliveryAddress: String,   // Required
  deliveryPhone: String,     // Required
  status: String,            // "PLACED", "PREPARING", "DELIVERED", "CANCELLED"
  paymentMethod: String,     // "CREDIT_CARD", "DEBIT_CARD", "UPI", "COD"
  paymentStatus: String,     // "PENDING", "COMPLETED", "FAILED"
  paymentId: String,         // Optional payment gateway ID
  notes: String,             // Optional, Max: 500 characters
  deliveryTime: Date,        // Optional scheduled delivery
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId`
- `status`
- `paymentStatus`
- `createdAt`

**Validations**:
- OrderItems quantity: Min 1
- OrderItems price: Min 0
- TotalAmount: Min 0
- Status: Must be "PLACED", "PREPARING", "DELIVERED", or "CANCELLED"
- PaymentMethod: Must be "CREDIT_CARD", "DEBIT_CARD", "UPI", or "COD"
- PaymentStatus: Must be "PENDING", "COMPLETED", or "FAILED"
- Notes: Max 500 characters

**Relationships**:
- Belongs to one Customer (userId)
- Contains many Meals through orderItems (N:N)

---

### 7. Reviews Collection

**Model**: `review.model.js`

**Purpose**: Customer reviews and ratings

**Schema**:
```javascript
{
  userId: ObjectId,          // Reference to User (Customer)
  messId: ObjectId,          // Reference to Mess
  mealId: ObjectId,          // Optional - Reference to Meal
  rating: Number,            // Min: 1, Max: 5
  comment: String,           // Min: 10, Max: 500 characters
  isVerifiedPurchase: Boolean, // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId`
- `messId`
- `mealId`
- `rating`

**Validations**:
- Rating: 1-5 (integer)
- Comment: 10-500 characters

**Relationships**:
- Belongs to one Customer (userId)
- Belongs to one Mess (messId)
- Optionally belongs to one Meal (mealId)

---

### 8. Contact Us Collection

**Model**: `contactus.model.js`

**Purpose**: Customer inquiries and support requests

**Schema**:
```javascript
{
  userId: ObjectId,          // Reference to User (optional)
  name: String,              // Min: 3, Max: 50 characters
  email: String,             // Validated email format
  phone: String,             // Optional, Indian mobile format
  subject: String,           // Min: 5, Max: 100 characters
  message: String,           // Min: 10, Max: 1000 characters
  status: String,            // "PENDING", "IN_PROGRESS", "RESOLVED"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId`
- `status`
- `createdAt`

**Validations**:
- Name: 3-50 characters
- Email: Valid email format
- Phone: Must match `/^[6-9]\d{9}$/` pattern (if provided)
- Subject: 5-100 characters
- Message: 10-1000 characters
- Status: Must be "PENDING", "IN_PROGRESS", or "RESOLVED"

**Relationships**:
- Optionally belongs to one User (userId)

---

## Entity Relationship Diagram

```
┌──────────────┐
│     User     │
│              │
│ - role       │
│ - name       │
│ - email      │
│ - password   │
└──┬────────┬──┘
   │        │
   │        └──────────────────────┐
   │                               │
┌──▼───────────────┐    ┌─────────▼────────┐
│ CustomerProfile  │    │  OwnerProfile    │
│                  │    │                  │
│ - phone          │    │ - businessName   │
│ - address        │    │ - phone          │
│ - dietary...     │    │ - address        │
└──┬───────────────┘    └─────────┬────────┘
   │                              │
   │                    ┌─────────▼────────┐
   │                    │      Mess        │
   │                    │                  │
   │                    │ - name           │
   │                    │ - area           │
   │                    │ - address        │
   │                    └─────────┬────────┘
   │                              │
   │                    ┌─────────▼────────┐
   │                    │      Meal        │
   │                    │                  │
   │                    │ - name           │
   │                    │ - mealType       │
   │                    │ - price          │
   │                    └─────────┬────────┘
   │                              │
   │                              │
┌──▼──────────────┐    ┌─────────▼────────┐
│     Order       │◄───│   OrderItems     │
│                 │    └──────────────────┘
│ - totalAmount   │
│ - status        │
│ - paymentStatus │
└──┬──────────────┘
   │
┌──▼──────────────┐
│    Review       │
│                 │
│ - rating        │
│ - comment       │
└─────────────────┘
```

## Data Flow

### 1. User Registration Flow
```
1. User submits registration data
2. Password is hashed (pre-save middleware)
3. User document created in Users collection
4. User can create CustomerProfile or OwnerProfile
```

### 2. Mess Creation Flow
```
1. Owner creates OwnerProfile
2. Owner creates Mess (ownerId = owner's userId)
3. Mess document saved with owner reference
```

### 3. Meal Creation Flow
```
1. Owner must own a Mess
2. Meal created with messId reference
3. Meal linked to parent Mess
```

### 4. Order Placement Flow
```
1. Customer selects meals from various messes
2. Order created with userId (customer)
3. OrderItems array populated with mealId, quantity, price
4. TotalAmount calculated from orderItems
5. Order status set to "PLACED"
6. Payment status set to "PENDING"
```

### 5. Review Submission Flow
```
1. Customer must have placed an order
2. Review created with userId, messId
3. Optionally linked to specific mealId
4. IsVerifiedPurchase set based on order history
```

## Common Queries

### Find All Meals by Mess
```javascript
Meal.find({ messId: messId }).populate('messId');
```

### Find All Orders by Customer
```javascript
Order.find({ userId: customerId })
  .populate('orderItems.mealId')
  .sort({ createdAt: -1 });
```

### Find All Messes by Owner
```javascript
Mess.find({ ownerId: ownerId });
```

### Get Reviews for a Mess
```javascript
Review.find({ messId: messId })
  .populate('userId', 'name')
  .sort({ createdAt: -1 });
```

### Find Available Vegetarian Meals
```javascript
Meal.find({ 
  is_Veg: true, 
  is_Available: true 
}).populate('messId');
```

## Optimization Strategies

### 1. Indexing
- Compound indexes for frequently queried combinations
- Single field indexes on foreign keys
- Text indexes for search functionality (future)

### 2. Query Optimization
- Use `.lean()` for read-only queries
- Project only required fields
- Limit and pagination for large datasets

### 3. Connection Pooling
- MongoDB connection pool configured
- Connection reuse across requests

### 4. Data Denormalization (Future)
- Cache mess name in meals for faster queries
- Store total orders count in mess document
- Average rating in mess document

## Backup Strategy (Planned)

### 1. Automated Backups
- Daily database dumps
- Weekly incremental backups
- Monthly full backups

### 2. Backup Storage
- Cloud storage (AWS S3 or similar)
- Multiple geographic locations
- Encrypted backups

### 3. Restore Procedures
- Documented restore process
- Regular restore testing
- Point-in-time recovery

## Migration Strategy

### Schema Changes
1. Create migration script
2. Test in development
3. Backup production database
4. Run migration in production
5. Verify data integrity

### Version Control
- Migration files numbered sequentially
- Rollback scripts for each migration
- Migration logs

## Performance Monitoring

### Metrics to Track
- Query execution time
- Collection sizes
- Index usage statistics
- Connection pool status

### Tools
- MongoDB Atlas monitoring
- Mongoose query logging
- Custom analytics

## Security Considerations

### 1. Data Encryption
- Passwords hashed with bcrypt (salt rounds: 10)
- Sensitive data encrypted at rest
- SSL/TLS for data in transit

### 2. Access Control
- Database user with limited permissions
- Application-level authorization
- IP whitelisting for production

### 3. Validation
- Mongoose schema validation
- Additional application-layer validation
- Input sanitization

### 4. Audit Logging
- Track sensitive operations
- Log data modifications
- User activity logging

## Data Retention Policy

### Active Data
- All current records maintained

### Inactive Data (Future)
- Orders older than 2 years archived
- Deleted users retained for 30 days
- Reviews kept indefinitely

### GDPR Compliance
- User data deletion on request
- Data export functionality
- Consent management

## Troubleshooting

### Common Issues

**Connection Errors**
```javascript
// Check MongoDB service is running
// Verify connection string
// Check network connectivity
```

**Validation Errors**
```javascript
// Review schema constraints
// Check required fields
// Verify data types
```

**Performance Issues**
```javascript
// Add indexes for slow queries
// Use .lean() for read operations
// Implement pagination
```

## Future Enhancements

### 1. Full-Text Search
- Text indexes on meal names and descriptions
- Search autocomplete
- Fuzzy matching

### 2. Geospatial Queries
- Location-based mess discovery
- Distance calculations
- Delivery radius

### 3. Aggregation Pipeline
- Analytics dashboards
- Sales reports
- Popular meals tracking

### 4. Real-time Features
- Change streams for live updates
- Order status notifications
- Inventory tracking

### 5. Data Analytics
- Customer behavior analysis
- Sales trends
- Performance metrics
