# Configuration Module

This directory contains all configuration files for the Mama's Kitchen backend application.

## Files

### db.config.js
Database connection configuration using Mongoose.

**Purpose:**
- Establishes connection to MongoDB
- Handles connection errors
- Provides graceful error handling

**Usage:**
```javascript
import connectDB from './config/db.config.js';

const MONGO_URI = process.env.MONGO_URI;
await connectDB(MONGO_URI);
```

**Features:**
- Async/await pattern
- Error logging
- Process exit on connection failure
- Connection success confirmation

## Environment Variables Required

- `MONGO_URI`: MongoDB connection string

## Future Enhancements

- [ ] Connection retry logic
- [ ] Connection pooling configuration
- [ ] Database event listeners (disconnect, reconnect)
- [ ] Multiple database support
- [ ] Read/write replica configuration
