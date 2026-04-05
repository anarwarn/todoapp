# Authentication API - Project Report

**Project Name:** Auth-API (Full-Stack Authentication System)  
**Date:** April 5, 2026  
**Developer:** [Anar Velizade]

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Database Design](#database-design)
7. [Key Features & Functionality](#key-features--functionality)
8. [API Endpoints](#api-endpoints)
9. [Setup & Installation](#setup--installation)
10. [How Authentication Works](#how-authentication-works)
11. [Challenges & Solutions](#challenges--solutions)

---

## Project Overview

This is a **full-stack web application** that implements a complete user authentication system. The project consists of:

- **Backend**: Node.js/Express server with MongoDB integration
- **Frontend**: React application with modern UI/UX
- **Authentication**: Session-based authentication system
- **Database**: MongoDB for persistent data storage

### Purpose
The application allows users to:
- Create new accounts (register)
- Log into existing accounts
- Maintain secure session-based authentication
- Check authentication status
- Log out securely

---

## Architecture & Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | Latest | UI library for building interactive components |
| Vite | Latest | Fast build tool and development server |
| CSS3 | Modern | Styling with gradients and animations |
| JavaScript (ES6+) | Latest | Application logic |

### Backend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | v20+ | JavaScript runtime environment |
| Express.js | ^5.2.1 | Web framework for building APIs |
| MongoDB | ^9.3.1 | NoSQL database for storing user data |
| Express-Session | ^1.17.3 | Session management middleware |
| Bcrypt | ^5.1.1 | Password hashing and security |
| CORS | ^2.8.6 | Cross-Origin Resource Sharing |
| Dotenv | ^17.3.1 | Environment variable management |
| Mongoose | ^9.3.1 | MongoDB object modeling |
| Nodemon | Dev Tool | Auto-restart server on file changes |

### Architecture Pattern
- **MVC (Model-View-Controller)** architecture
- **RESTful API** design
- **Session-based Authentication** (server-side)

---

## Project Structure

```
auth-api/
├── backend/
│   ├── config.env                 # Environment variables
│   ├── package.json               # Backend dependencies
│   └── src/
│       ├── server.js              # Express server setup
│       ├── controllers/
│       │   ├── UserController.js  # User authentication logic
│       │   └── todosController.js # Todo management logic
│       ├── models/
│       │   └── User.js            # User database schema
│       └── routers/
│           ├── UserRoute.js       # User authentication routes
│           └── TodosRouter.js     # Todo routes
│
├── frontend/
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── index.html                 # Main HTML entry
│   └── src/
│       ├── main.jsx               # React entry point
│       ├── App.jsx                # Main app component
│       ├── index.css              # Global styles
│       ├── components/
│       │   ├── loginform.jsx      # Login/Register component
│       │   └── loginform.css      # Form styling
│       └── pages/
│           ├── loginpage.jsx      # Login page
│           └── signuppage.jsx     # Signup page
│
└── README.md                      # Project documentation
```

---

## Backend Implementation

### 1. Server Setup (`backend/src/server.js`)

```javascript
const express = require("express");
const app = express();
const userRouter = require("./routers/UserRoute");
const todoRouter = require("./routers/TodosRouter");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");

// Configuration
dotenv.config({path: path.join(__dirname, '../config.env')});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware Setup
app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true                   // Allow cookies
}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'simple-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,        // Set to true for HTTPS
    httpOnly: true,       // Can't be accessed via JavaScript
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use("/users", userRouter);
app.use("/todos", todoRouter);

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**Key Concepts:**
- **CORS**: Enables communication between frontend (5173) and backend (3000)
- **Sessions**: Server stores user sessions, clients get session cookies
- **Middleware**: Express processes requests through middleware chain
- **MongoDB**: Uses Mongoose for schema validation and ORM

### 2. User Model (`backend/src/models/User.js`)

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true  // Auto-adds createdAt and updatedAt
});

// Hash password before saving (pre-hook)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to verify passwords
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**Security Features:**
- **Password Hashing**: Bcrypt with salt rounds (12) - irreversible encryption
- **Pre-hooks**: Automatically hash password before storing
- **Methods**: `comparePassword()` safely verifies user passwords

### 3. User Controller (`backend/src/controllers/UserController.js`)

#### Registration Logic
```javascript
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({ username, password });
    await user.save(); // Triggers password hashing

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.status(201).json({ 
      message: 'User registered successfully', 
      username: user.username 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Process Flow:**
1. Extract username and password from request
2. Validate input (not empty)
3. Check if user already exists
4. Create new user (password auto-hashed by pre-hook)
5. Save to database
6. Create session (server-side)
7. Send success response

#### Login Logic
```javascript
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.json({ message: 'Login successful', username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

**Security Measures:**
- Generic error messages (don't reveal if user exists)
- Bcrypt comparison (slow, resistant to brute force)
- Session creation only after successful auth

#### Logout & Status Check
```javascript
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

const getUser = (req, res) => {
  if (req.session.userId) {
    return res.json({ isAuthenticated: true, username: req.session.username });
  }
  res.json({ isAuthenticated: false });
};
```

### 4. Routes (`backend/src/routers/UserRoute.js`)

```javascript
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/UserController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/status', getUser);

module.exports = router;
```

---

## Frontend Implementation

### 1. Login Form Component (`frontend/src/components/loginform.jsx`)

This is the main authentication UI component with 140+ lines of code.

**Key Features:**
- Toggle between login and register modes
- Form validation (required fields)
- Loading states
- Error/success messages
- Session-based authentication
- Logout functionality

```javascript
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [isRegister, setIsRegister] = useState(false);
const [message, setMessage] = useState('');
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
```

**Registration/Login Flow:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const endpoint = isRegister ? '/users/register' : '/users/login';
  setLoading(true);
  
  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Send cookies with request
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      setMessage(data.message);
      setUser(data.username);  // Update UI
      setUsername('');
      setPassword('');
    } else {
      setMessage(data.message);
    }
  } catch (error) {
    setMessage('Error: ' + error.message);
  } finally {
    setLoading(false);
  }
};
```

**Logout Handler:**
```javascript
const handleLogout = async () => {
  try {
    const res = await fetch('http://localhost:3000/users/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (res.ok) {
      setUser(null);
      setMessage('Logged out successfully');
    }
  } catch (error) {
    setMessage('Logout error: ' + error.message);
  }
};
```

### 2. Styling (`frontend/src/components/loginform.css`)

**Modern Design Features:**
- Gradient background (purple theme)
- Animated floating decorations
- Smooth transitions and hover effects
- Responsive design (works on mobile/tablet/desktop)
- Professional card layout
- Loading states with visual feedback

```css
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-input:focus {
  outline: none;
  border-color: #667eea;
  transform: translateY(-2px);  /* Lift effect */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. Page Components

**LoginPage** (`frontend/src/pages/loginpage.jsx`)
- Simple wrapper component
- Uses LoginForm component

**SignupPage** (`frontend/src/pages/signuppage.jsx`)
- Standalone signup with form handling

---

## Database Design

### User Collection (MongoDB)

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "password": "$2a$12$abcdef123456...",  // Bcrypt hash
  "createdAt": "2026-04-05T10:30:00Z",
  "updatedAt": "2026-04-05T10:30:00Z"
}
```

**Database Advantages:**
- Flexible schema (NoSQL)
- Built-in ID generation (_id)
- Timestamps for audit trails
- Scalable for future features

---

## Key Features & Functionality

### ✅ Implemented Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| User Registration | `/users/register` endpoint | ✅ Complete |
| User Login | `/users/login` endpoint | ✅ Complete |
| Session Management | Express-session middleware | ✅ Complete |
| Password Hashing | Bcrypt (salt rounds: 12) | ✅ Secure |
| User Logout | `/users/logout` endpoint | ✅ Complete |
| Auth Status Check | `/users/status` endpoint | ✅ Complete |
| CORS Support | Cross-origin requests allowed | ✅ Configured |
| Error Handling | Try-catch blocks, HTTP status codes | ✅ Implemented |
| Responsive UI | Mobile-friendly design | ✅ Included |
| Form Validation | Frontend input validation | ✅ Present |
| Loading States | UI feedback during requests | ✅ Implemented |

### 🔄 User Journey

```
1. User visits application
   ↓
2. Sees login/register form
   ↓
3. Choose to register (new user)
   ├─ Enter username & password
   ├─ Frontend validates input
   ├─ Sends POST to /users/register
   ├─ Backend creates user & hashes password
   ├─ Server creates session
   ├─ User is logged in automatically
   └─ Shows welcome screen
   ↓
4. Or choose to login (existing user)
   ├─ Enter username & password
   ├─ Front end sends POST to /users/login
   ├─ Backend verifies credentials
   ├─ Compares password with hash
   ├─ Server creates session
   └─ Shows welcome screen
   ↓
5. User can logout
   └─ Session destroyed, cookies cleared
```

---

## API Endpoints

### User Authentication Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/users/register` | Create new user | `{username, password}` | `{message, username}` |
| POST | `/users/login` | User login | `{username, password}` | `{message, username}` |
| POST | `/users/logout` | User logout | None | `{message}` |
| GET | `/users/status` | Check auth status | None | `{isAuthenticated, username?}` |

### Example Requests

**Registration:**
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"securePassword123"}'
```

**Response (Success):**
```json
{
  "message": "User registered successfully",
  "username": "john_doe"
}
```

**Login:**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"securePassword123"}'
```

---

## Setup & Installation

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create config.env file with:
MONGO_URI=mongodb://localhost:27017/auth-api
SESSION_SECRET=your-secret-key
PORT=3000

# Start server
npm run dev    # Development with auto-reload
# or
npm start      # Production
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Full Application Flow

```
1. MongoDB runs (background or cloud)
   ↓
2. Backend starts on http://localhost:3000
   ↓
3. Frontend starts on http://localhost:5173
   ↓
4. Browser opens frontend
   ↓
5. User can register/login
```

---

## How Authentication Works

### Session-Based Authentication Explained

**Why Sessions Instead of JWT?**
- Sessions: Server stores data, more secure
- JWT: Client stores data, lighter weight
- This project uses sessions for security

### Session Flow

```
1. User logs in with username/password
   ↓
2. Server verifies credentials
   ↓
3. Server creates session object
   └─ req.session.userId = user._id
   └─ req.session.username = user.username
   ↓
4. Server sends Set-Cookie header
   └─ Contains session ID (connect.sid)
   ↓
5. Browser saves cookie
   ↓
6. Every request includes cookie
   ↓
7. Server matches cookie to session
   └─ Retrieves userId and username
   ↓
8. User remains authenticated
```

### Cookie Security

```javascript
cookie: { 
  secure: false,      // HTTPS only (false in dev)
  httpOnly: true,     // Can't access via JavaScript
  maxAge: 24 * 60 * 60 * 1000  // Expires in 24 hours
}
```

### Password Security

```
Password → Bcrypt → Hash (stored in DB)
                    ↓
                   $2a$12$abcd...def

Later:
Input Password → Bcrypt Compare → Matches?
                                   ↓
                              Yes → Login succeeds
                              No → Login fails
```

**Why Bcrypt?**
- One-way hashing (can't reverse)
- Salt rounds (12) = slow, brute-force resistant
- Industry standard for passwords

---

## Challenges & Solutions

### Challenge 1: Email vs Username
**Problem:** Initial design used email field
**Solution:** Simplified to username-only for faster development

### Challenge 2: JWT to Sessions
**Problem:** JWT adds complexity
**Solution:** Migrated to express-session for better security

### Challenge 3: CORS Errors
**Problem:** Frontend couldn't communicate with backend
**Solution:** Configured CORS with credentials: true

```javascript
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true 
}));
```

### Challenge 4: Password Hashing Timing
**Problem:** Password hashing took time before saving
**Solution:** Used pre-save hook to auto-hash

```javascript
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});
```

### Challenge 5: Frontend State Management
**Problem:** Multiple state updates needed
**Solution:** Used React hooks (useState) efficiently

```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');
```

---

## Code Quality & Best Practices

### ✅ Security Implementations
1. **Password Hashing**: Bcrypt with 12 salt rounds
2. **HTTP-Only Cookies**: Prevent XSS attacks
3. **CORS Configuration**: Restricted origins
4. **Session Validation**: Check `req.session.userId`
5. **Generic Error Messages**: Don't reveal user existence
6. **Input Validation**: Required fields checked

### ✅ Code Organization
1. **MVC Pattern**: Separation of concerns
2. **Modular Routes**: Separate route files
3. **Reusable Controllers**: Handle multiple endpoints
4. **Component-Based Frontend**: Reusable UI components

### ✅ Error Handling
1. Try-catch blocks for async operations
2. HTTP status codes (201, 400, 500)
3. User-friendly error messages
4. Server-side validation

### ✅ Development Practices
1. Environment variables (.env files)
2. Auto-reload with nodemon
3. Console logging for debugging
4. Proper database connection handling

---

## Potential Improvements

### Future Enhancements (Not Yet Implemented)

1. **Email Verification**
   - Send confirmation link
   - Verify before account activation

2. **Password Reset**
   - Forgot password functionality
   - Email reset link

3. **Two-Factor Authentication (2FA)**
   - SMS or authenticator app
   - Enhanced security

4. **User Profiles**
   - Update username/password
   - Profile picture
   - Additional info

5. **Todo Management**
   - Save, edit, delete todos
   - Associate with user

6. **Production Deployment**
   - HTTPS/SSL certificates
   - Environment-specific configs
   - Database backups
   - Server monitoring

7. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - End-to-end tests (Cypress)

8. **Performance Optimization**
   - Database indexing
   - Caching strategies
   - API rate limiting

---

## Conclusion

This **Auth-API project** demonstrates a complete, functional authentication system with:

✅ Secure password handling (Bcrypt)
✅ Session-based authentication (Express-session)
✅ Modern, responsive frontend (React + CSS animations)
✅ RESTful API design
✅ MongoDB database integration
✅ Error handling and validation
✅ Professional UI/UX design

The project follows industry best practices and provides a solid foundation for extending with additional features like todos, user profiles, and advanced security measures.

---

## References & Technologies

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [Bcrypt Security](https://en.wikipedia.org/wiki/Bcrypt)
- [React Hooks](https://react.dev/reference/react)
- [Session-Based Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

**Project Completion Date:** April 5, 2026  
**Status:** ✅ Fully Functional
