# AASC Backend API

Backend server for Achariya Arts and Science College website with MongoDB Atlas, role-based authentication, and automatic fallback to static data.

## 🚀 Features

- **MongoDB Atlas Integration** with automatic reconnection
- **Role-Based Authentication** (Admin, Moderator, User)
- **JWT-based** secure authentication
- **Automatic Fallback** to static data on database failure
- **RESTful API** design
- **Rate Limiting** for DDoS protection
- **Security Headers** with Helmet
- **CORS Configuration** for frontend integration
- **Error Handling** with detailed logging

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account
- Git

## ⚙️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your settings:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (Already configured with your MongoDB Atlas URL)
MONGODB_URI=mongodb+srv://webdeveloper:Achariya@26@cluster0.drjbrbn.mongodb.net/aasc_db?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=24h

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Admin User (for first-time setup)
ADMIN_EMAIL=admin@achariya.org
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=System Administrator
```

### 3. Create First Admin User

```bash
npm run seed:admin
```

This will create an admin user with credentials from `.env` file.

**Default Credentials:**

- Email: `admin@achariya.org`
- Password: `Admin@123456`

⚠️ **IMPORTANT**: Change the password after first login!

## 🏃 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check

```
GET /api/health
```

Returns server status, database connection, and cache statistics.

### Authentication

| Method | Endpoint                    | Description       | Access  |
| ------ | --------------------------- | ----------------- | ------- |
| POST   | `/api/auth/login`           | Login user        | Public  |
| GET    | `/api/auth/me`              | Get current user  | Private |
| PUT    | `/api/auth/update-password` | Update password   | Private |
| POST   | `/api/auth/register`        | Register new user | Admin   |
| GET    | `/api/auth/users`           | Get all users     | Admin   |
| PUT    | `/api/auth/users/:id/role`  | Update user role  | Admin   |
| DELETE | `/api/auth/users/:id`       | Deactivate user   | Admin   |

### Login Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@achariya.org",
    "password": "Admin@123456"
  }'
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "System Administrator",
      "email": "admin@achariya.org",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using Authentication Token

Include the token in the `Authorization` header for protected routes:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗂️ Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection with retry & monitoring
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── roleCheck.js         # Role-based access control
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── User.js              # User model with bcrypt
│   ├── Home/                # Home section models
│   ├── Event.js             # Events model
│   └── Faculty.js           # Faculty model
├── routes/
│   └── auth.js              # Authentication routes
├── scripts/
│   └── createAdmin.js       # Admin user creation script
├── utils/
│   └── cache.js             # Static data caching for fallback
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

## 🔐 User Roles

### Admin

- Full access to all features
- Can create/update/delete all content
- Can manage users and assign roles
- Can deactivate users

### Moderator

- Can create/update/delete content
- Cannot manage users
- Content management privileges only

### User

- Read-only access (future use)
- Can be expanded for student/alumni features

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, expiring tokens
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **MongoDB Injection Protection**: express-mongo-sanitize
- **Security Headers**: Helmet middleware
- **CORS**: Configured whitelist
- **Input Validation**: express-validator

## 🔄 Fallback System

The system automatically serves static data from `/client/src/data` when:

- Database connection is lost
- MongoDB Atlas is unreachable
- Any database query fails

### How it Works

1. On startup, server loads all static data files into memory
2. Health monitoring checks database every 30 seconds
3. If disconnected, fallback mode activates
4. API responses include `fallback: true` flag
5. Frontend can display appropriate messages

### Checking Fallback Status

```bash
curl http://localhost:5000/api/health
```

Response includes:

```json
{
  "database": {
    "connected": false,
    "fallbackMode": true
  }
}
```

## 📊 Database Seeding

To populate the database with initial data from static files:

```bash
npm run seed
```

This will:

- Read all files from `/client/src/data`
- Create corresponding database entries
- Preserve existing relationships

## 🧪 Testing

Run tests with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 🚀 Deployment

### DigitalOcean VPS Deployment

1. **Install Node.js and PM2**

```bash
# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

2. **Clone Repository**

```bash
cd /var/www
git clone <your-repo-url> aasc-backend
cd aasc-backend/server
```

3. **Install Dependencies**

```bash
npm install --production
```

4. **Configure Environment**

```bash
cp .env.example .env
nano .env  # Edit with production values
```

5. **Create Admin User**

```bash
npm run seed:admin
```

6. **Start with PM2**

```bash
pm2 start server.js --name aasc-backend
pm2 save
pm2 startup
```

7. **Configure Nginx Reverse Proxy**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **SSL Certificate (Let's Encrypt)**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### PM2 Commands

```bash
# View logs
pm2 logs aasc-backend

# Restart server
pm2 restart aasc-backend

# Stop server
pm2 stop aasc-backend

# Monitor
pm2 monit
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to MongoDB Atlas

**Solutions**:

1. Check MongoDB URL in `.env`
2. Verify IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)
3. Check network connectivity
4. Server will automatically use fallback mode

### JWT Token Errors

**Problem**: Token invalid or expired

**Solutions**:

1. Token expires after 24 hours - login again
2. Check JWT_SECRET matches in .env
3. Clear browser cache/cookies

### Permission Denied Errors

**Problem**: 403 Forbidden on admin routes

**Solutions**:

1. Verify user role is 'admin' or 'moderator'
2. Check Authorization header format: `Bearer <token>`
3. Token must be from a valid, active user

## 📝 Environment Variables Reference

| Variable          | Description               | Default            | Required |
| ----------------- | ------------------------- | ------------------ | -------- |
| `NODE_ENV`        | Environment mode          | development        | No       |
| `PORT`            | Server port               | 5000               | No       |
| `MONGODB_URI`     | MongoDB connection string | -                  | Yes      |
| `JWT_SECRET`      | JWT signing secret        | -                  | Yes      |
| `JWT_EXPIRE`      | Token expiration          | 24h                | No       |
| `ALLOWED_ORIGINS` | CORS allowed origins      | localhost:5173     | No       |
| `ADMIN_EMAIL`     | First admin email         | admin@achariya.org | No       |
| `ADMIN_PASSWORD`  | First admin password      | -                  | Yes      |

## 📞 Support

For issues or questions:

- Email: admin@achariya.org
- GitHub Issues: [Create an issue]

## 📄 License

MIT License - Achariya Arts and Science College

---

**Created with ❤️ for AASC**
