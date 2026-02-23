# Authentication Setup Guide

## Overview

The Schooler Management System now includes complete authentication using **NextAuth.js** for the frontend and **JWT tokens** for the backend API.

## Features Implemented

### Backend (API)

- ✅ User model with password hashing (bcrypt)
- ✅ JWT-based authentication
- ✅ Login endpoint (`POST /api/v1/auth/login`)
- ✅ Register endpoint (`POST /api/v1/auth/register`)
- ✅ Get current user (`GET /api/v1/auth/me`)
- ✅ Change password (`POST /api/v1/auth/change-password`)
- ✅ Multi-role support (admin, teacher, student, parent, employee)

### Frontend (UI)

- ✅ NextAuth.js integration
- ✅ Credentials provider for email/password login
- ✅ Session management with JWT strategy
- ✅ Login page (`/login`)
- ✅ Protected routes middleware
- ✅ Axios interceptor for automatic token injection
- ✅ useAuth hook for easy access to auth state

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies

The following packages are already installed:

- `jsonwebtoken` - For JWT token generation/verification
- `bcryptjs` - For password hashing
- `@types/jsonwebtoken` & `@types/bcryptjs` - TypeScript types

#### Environment Variables

Create a `.env` file in `schooler_api/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/schooler
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` in production!

### 2. Frontend Setup

#### Install Dependencies

The following packages are already installed:

- `next-auth` - Authentication for Next.js
- `bcryptjs` - For client-side validation

#### Environment Variables

Create a `.env.local` file in `schooler_ui/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this
```

**Important:** Change `NEXTAUTH_SECRET` in production! Generate one with:

```bash
openssl rand -base64 32
```

### 3. Database Setup

#### Create Initial Admin User

Before you can login, you need to create at least one user in the database:

```javascript
// Run this in MongoDB or create a seed script

// 1. First create an Employee (for admin role)
db.employees.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@schooler.com",
  phone: "1234567890",
  dateOfBirth: new Date("1990-01-01"),
  gender: "male",
  address: {
    street: "123 Main St",
    city: "City",
    state: "State",
    zipCode: "12345",
    country: "Country",
  },
  position: "Administrator",
  department: "Administration",
  salary: 50000,
  status: "active",
  emergencyContact: {
    name: "Emergency Contact",
    relationship: "Family",
    phone: "9876543210",
  },
});

// 2. Get the employee _id from the previous insert
// 3. Create a User account linked to that employee
db.users.insertOne({
  email: "admin@schooler.com",
  password: "$2a$10$YourHashedPasswordHere", // bcrypt hash of your password
  role: "admin",
  referenceId: ObjectId("employee_id_from_step_1"),
  isActive: true,
});
```

Or use the register endpoint:

```bash
POST /api/v1/auth/register
{
  "email": "admin@schooler.com",
  "password": "YourPassword123",
  "role": "admin",
  "referenceId": "employee_id_here"
}
```

## Usage

### Login Flow

1. Navigate to `/login`
2. Enter credentials:
   - Email: `admin@schooler.com`
   - Password: Your password
3. On successful login, you'll be redirected to the dashboard

### Protected Routes

The following routes are automatically protected by middleware:

- `/admin/*` - Admin only
- `/teacher/*` - Teacher role
- `/student/*` - Student role
- `/parent/*` - Parent role

Unauthenticated users will be redirected to `/login`.

### Using Authentication in Components

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

function MyComponent() {
  const { user, isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Role: {role}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

### Accessing User Session

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// In Server Components
const session = await getServerSession(authOptions);

// In API Routes
const session = await getServerSession(req, res, authOptions);

// In Client Components
import { useSession } from "next-auth/react";
const { data: session } = useSession();
```

### API Calls with Authentication

The axios instance automatically includes the JWT token in headers:

```typescript
import api from "@/lib/axios";

// Token is automatically added to the Authorization header
const response = await api.get("/students");
```

## API Endpoints

### Authentication Endpoints

#### Login

```
POST /api/v1/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": { ... }
  }
}
```

#### Register

```
POST /api/v1/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "role": "teacher",
  "referenceId": "teacher_id_here"
}
```

#### Get Current User

```
GET /api/v1/auth/me
Headers: {
  "Authorization": "Bearer jwt_token"
}
```

#### Change Password

```
POST /api/v1/auth/change-password
Headers: {
  "Authorization": "Bearer jwt_token"
}
Body: {
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

## User Roles

The system supports 5 user roles:

1. **admin** - Full system access (linked to Employee)
2. **teacher** - Teacher portal (linked to Teacher)
3. **student** - Student portal (linked to Student)
4. **parent** - Parent portal (linked to Parent)
5. **employee** - Staff portal (linked to Employee)

Each user role is linked to their respective profile in the database via `referenceId`.

## Security Considerations

1. ✅ Passwords are hashed using bcrypt with salt rounds of 10
2. ✅ JWT tokens expire after 7 days (configurable)
3. ✅ Tokens are stored in httpOnly cookies (NextAuth)
4. ✅ Protected routes require authentication
5. ⚠️ **Change JWT_SECRET and NEXTAUTH_SECRET in production!**
6. ⚠️ Use HTTPS in production
7. ⚠️ Implement rate limiting for login attempts (recommended)

## Troubleshooting

### "Invalid credentials" error

- Verify the user exists in the database
- Check the password is correct
- Ensure the user's `isActive` field is `true`

### "User not found or inactive"

- The referenced profile (Teacher/Student/etc.) may have been deleted
- Check the `referenceId` matches an existing document

### Infinite redirect loop

- Clear browser cookies
- Check NEXTAUTH_URL matches your actual URL
- Verify middleware configuration

### Token not being sent with requests

- Check the session is active
- Verify axios interceptor is configured
- Check browser console for errors

## Next Steps

1. Create a user registration flow for different roles
2. Add password reset functionality
3. Implement role-based access control (RBAC) for specific features
4. Add session management UI (view active sessions, logout from all devices)
5. Implement 2FA (Two-Factor Authentication)
6. Add activity logging for security auditing

---

**Created:** February 19, 2026  
**Version:** 1.0
