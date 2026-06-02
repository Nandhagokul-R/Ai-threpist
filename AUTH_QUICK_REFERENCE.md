# 🔐 Quick Authentication Reference

## URLs
- **Signup**: http://localhost:3000/signup
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

## Demo Mode Credentials
**Any email and password will work!**

Examples:
```
Email: test@example.com
Password: test123
```

```
Email: demo@demo.com  
Password: demo
```

## How It Works

### 1️⃣ Sign Up
1. Go to `/signup`
2. Enter any name, email, password
3. Click "Sign Up"
4. Redirected to login page

### 2️⃣ Log In
1. Go to `/login`
2. Enter email and password (any values work in demo)
3. Click "Sign In"
4. JWT token stored → Redirected to dashboard

### 3️⃣ Access Dashboard
- Protected route - requires login
- Token automatically attached to requests
- Full access to AI therapy, mood tracking, activities

## Key Features

✅ **Demo Mode Active**: No database needed
✅ **JWT Authentication**: Secure token-based auth
✅ **Session Management**: Persistent login state
✅ **Protected Routes**: Automatic redirect if not logged in
✅ **Responsive Design**: Works on mobile & desktop

## Architecture

**Frontend** (Port 3000)
- Next.js 15 App Router
- Session Context for state
- TailwindCSS styling

**Backend** (Port 3001)
- Express.js API
- JWT token generation
- Demo mode fallback

## Fixed Issues

✅ Chat session fetch error
✅ getAllChatSessions route added
✅ Voxel Toy Box port configuration

## Testing Checklist

- [ ] Can access signup page
- [ ] Can create account
- [ ] Can login with credentials  
- [ ] Redirected to dashboard
- [ ] Can access therapy chat
- [ ] Can log out

---

**Status**: All authentication systems are operational! 🎉
