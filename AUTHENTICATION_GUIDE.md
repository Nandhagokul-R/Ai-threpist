# AI Therapist Application - Authentication Setup Guide

## Overview
Your AI Therapist application has a complete authentication system with sign-up and login functionality. The system works in **demo mode** for development, so you don't need a database connection to test it.

---

## 🎯 Current Setup

### Frontend Pages:
- **Login Page**: `http://localhost:3000/login`
- **Signup Page**: `http://localhost:3000/signup`
- **Dashboard** (protected): `http://localhost:3000/dashboard`

### Backend API Endpoints:
- **Register**: `POST http://localhost:3001/auth/register`
- **Login**: `POST http://localhost:3001/auth/login`
- **Logout**: `POST http://localhost:3001/auth/logout`
- **Get User**: `GET http://localhost:3001/auth/me`

---

## 🚀 How to Use

### 1. Sign Up (Create Account)

**Navigate to**: `http://localhost:3000/signup`

**Fill in the form**:
- **Name**: Your full name
- **Email**: Any email format (e.g., `demo@example.com`)
- **Password**: Any password
- **Confirm Password**: Must match password

**What happens**:
- In **demo mode**: The system bypasses the database and creates a mock user
- In **production**: Actual user is created in MongoDB database with bcrypt password hashing
- After successful signup, you'll be redirected to the login page

---

### 2. Log In

**Navigate to**: `http://localhost:3000/login`

**Fill in the form**:
- **Email**: The email you signed up with (or any email in demo mode)
- **Password**: The password you created (or any password in demo mode)

**What happens**:
- A JWT token is generated and stored in `localStorage`
- You're redirected to `/dashboard`
- The token is attached to all subsequent API requests via the `Authorization` header

---

### 3. Protected Routes

Once logged in, you can access:
- **Dashboard**: `http://localhost:3000/dashboard` - Your main interface
- **Therapy Chat**: `http://localhost:3000/therapy` - AI therapy sessions
- **Mood Tracking**: Via dashboard
- **Activities**: Various wellness activities

**If not logged in**:
- Attempting to access protected routes redirects you to `/login`

---

## 🔧 Demo Mode vs Production Mode

### Demo Mode (Current Setup)
**When**: `NODE_ENV !== "production"` OR when database is unavailable

**Features**:
- ✅ No database required
- ✅ Any email/password combination works
- ✅ Mock JWT tokens are generated
- ✅ Session persists during development
- ✅ Perfect for testing and development

**Login route** (`app/api/auth/login/route.ts`):
```typescript
if (process.env.NODE_ENV !== "production") {
  // Returns mock user data immediately
  return NextResponse.json({
    user: { _id: "mock-user-id", name: "Demo User", email },
    token: "mock-jwt-token-" + Date.now(),
    message: "Login successful (mock mode)"
  });
}
```

### Production Mode
**When**: Database is connected and `NODE_ENV === "production"`

**Features**:
- ✅ Real MongoDB user storage
- ✅ Bcrypt password hashing
- ✅ JWT tokens validated against database
- ✅ Session management in MongoDB
- ✅ Security best practices enforced

---

## 📂 File Structure

### Frontend
```
app/
├── login/
│   └── page.tsx          # Login UI component
├── signup/
│   └── page.tsx          # Signup UI component
└── api/
    └── auth/
        ├── login/
        │   └── route.ts  # Login API proxy
        └── register/
            └── route.ts  # Register API proxy

lib/
├── api/
│   └── auth.ts           # Auth API functions
└── contexts/
    └── session-context.tsx  # Session state management
```

### Backend
```
src/
├── routes/
│   └── auth.ts           # Auth routes
├── controllers/
│   └── authController.ts # Auth logic
├── models/
│   ├── User.ts           # User schema
│   └── Session.ts        # Session schema
└── middleware/
    └── auth.ts           # JWT verification middleware
```

---

## 🔐 Security Features

### Password Security
- ✅ Bcrypt hashing with salt rounds = 10
- ✅ Passwords never stored in plain text
- ✅ Password confirmation on signup

### Token Management
- ✅ JWT tokens with 24-hour expiry
- ✅ Tokens stored securely in localStorage
- ✅ Automatic token attachment to API requests
- ✅ Token validation on protected routes

### Session Handling
- ✅ Server-side session tracking
- ✅ Automatic cleanup of expired sessions
- ✅ Device info logging for security audits

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch chat sessions"
**Status**: ✅ FIXED
**Solution**: Added `getAllChatSessions` controller and route

### Issue: Login not working
**Check**:
1. Backend is running on port 3001
2. Frontend is running on port 3000
3. `.env.local` has correct `BACKEND_API_URL=http://localhost:3001`

### Issue: Redirect loops
**Check**:
1. Session context is properly initialized
2. Token is being stored in localStorage
3. No middleware blocking protected routes

### Issue: Database connection errors
**Solution**: Demo mode automatically activates, allowing testing without database

---

## 🎨 Custom Styling

Both login and signup pages use:
- **Gradient backgrounds**: `from-primary/10 via-background to-secondary/30`
- **Glass morphism effects**: `backdrop-blur-lg`
- **Smooth animations**: Tailwind transitions
- **Responsive design**: Mobile-first approach
- **Icon integration**: Lucide React icons

---

## 📝 Testing Credentials (Demo Mode)

You can use ANY credentials in demo mode:

```
Email: test@example.com
Password: password123
```

OR

```
Email: demo@demo.com
Password: demo
```

Both will work! The system creates a mock session for any input.

---

## 🔄 Authentication Flow

```
User fills form → Frontend validation → API call to /api/auth/{login|register}
    ↓
Next.js API route → Proxy to backend (localhost:3001/auth/{login|register})
    ↓
Backend controller → Mock mode check → Generate JWT
    ↓
Token returned → Stored in localStorage → Session updated
    ↓
Redirect to /dashboard → Protected routes accessible
```

---

## ✅ Next Steps

1. **Test Authentication**:
   - Open `http://localhost:3000/signup`
   - Create an account
   - Log in at `http://localhost:3000/login`
   - Access dashboard

2. **Customize**:
   - Update logo/branding in login/signup pages
   - Modify color scheme in `tailwind.config.ts`
   - Add email verification (optional)

3. **Production Deployment**:
   - Set up MongoDB Atlas
   - Configure environment variables
   - Enable production mode
   - Deploy to Vercel/Netlify (frontend) and Render (backend)

---

## 📞 Support

If you encounter any issues:
1. Check terminal logs for errors
2. Verify both frontend and backend are running
3. Clear localStorage: `localStorage.clear()` in browser console
4. Restart the integrated app launcher

---

**Status**: ✅ Authentication is fully functional in demo mode!
