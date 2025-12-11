# Database Setup & Seeding Instructions

## 1. Prerequisites

- Ensure MongoDB is running or `MONGODB_URI` is set in `.env`.
- Ensure `client/src/data` contains the source data files.

## 2. Setup Database

Run the consolidated seeder to:

1. Connect to MongoDB (Singleton).
2. Drop ALL existing collections.
3. Import data from `client/src/data`.
4. Create the Admin user.
5. Verify collection count (Target: 36).

```bash
npm run seed
```

## 3. Verify Installation

Check if the database has exactly 36 collections:

```bash
npm run db:verify
```

## 4. Usage in Backend

Import the singleton DB connection in your routes/controllers:

```javascript
import { getDb, getCollection } from "./db.js";

// Get DB instance
const db = await getDb();

// Get Collection
const users = await getCollection("users");
```
