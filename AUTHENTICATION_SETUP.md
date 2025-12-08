# Authentication System Setup Guide

## ✅ What's Been Fixed

### 1. **Display Name vs Username Separation**
- ✅ Display Name: User's full name (e.g., "John Doe")
- ✅ Username: Unique identifier (e.g., "@johndoe")
- ✅ Both are now stored separately in Firestore

### 2. **Authentication Flow**
- ✅ Email/Password signup now saves both displayName and username
- ✅ Google OAuth login checks for existing username
- ✅ New Google users are prompted to create a username
- ✅ Remember Me functionality works properly

### 3. **Protected Routes**
- ✅ Upload page now requires authentication
- ✅ Client-side auth checks instead of middleware
- ✅ Redirects to login if not authenticated

### 4. **Firestore Structure**
```
users/{userId}
  - username: string (unique identifier)
  - displayName: string (full name)
  - email: string
  - createdAt: timestamp
```

## 🔧 Firebase Console Setup (IMPORTANT!)

### Step 1: Enable Google Sign-In
1. Go to https://console.firebase.google.com/project/prodmised/authentication/providers
2. Click on "Google" provider
3. Toggle **Enable**
4. Add your support email
5. Click **Save**

### Step 2: Add Authorized Domains
1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add these domains:
   - `localhost` (for development)
   - `your-app.vercel.app` (your production domain)

### Step 3: Verify Environment Variables
Make sure your `.env.local` file has all these variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-8avAXUTeZxwYnN_VYRZrvJ7GLSp2ziM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prodmised.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prodmised
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prodmised.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=568975388346
NEXT_PUBLIC_FIREBASE_APP_ID=1:568975388346:web:e74a4a4c79dff2bf4f1af2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-E9XJ1QMC0G
```

## 🧪 Testing Checklist

### Email/Password Signup
- [ ] Fill in Display Name (e.g., "John Doe")
- [ ] Fill in Username (e.g., "johndoe")
- [ ] Fill in Email and Password
- [ ] Click Sign Up
- [ ] Verify redirect to home page
- [ ] Check navbar shows "@johndoe"

### Google OAuth Signup
- [ ] Click "Continue with Google"
- [ ] Select Google account
- [ ] Username modal should appear
- [ ] Enter username
- [ ] Click Continue
- [ ] Verify redirect to home page
- [ ] Check navbar shows your username

### Login
- [ ] Enter email and password
- [ ] Toggle Remember Me (optional)
- [ ] Click Sign In
- [ ] Verify redirect to home page
- [ ] Check navbar shows username

### Google OAuth Login (Existing User)
- [ ] Click "Continue with Google"
- [ ] Select Google account
- [ ] Should NOT show username modal
- [ ] Verify redirect to home page

### Upload Page Access
- [ ] Go to `/upload` while logged out
- [ ] Should redirect to `/login`
- [ ] Log in
- [ ] Navigate to `/upload`
- [ ] Should show upload page

### Remember Me
- [ ] Log in with Remember Me checked
- [ ] Close browser completely
- [ ] Open browser again
- [ ] Go to site - should still be logged in
- [ ] Log out
- [ ] Log in WITHOUT Remember Me
- [ ] Close browser tab (not entire browser)
- [ ] Open new tab to site - should be logged out

## 🚀 Deployment to Vercel

### Before Deploying
```bash
cd frontend
git add .
git commit -m "Fix authentication system with displayName and username separation"
git push
```

### In Vercel Dashboard
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add all 7 `NEXT_PUBLIC_FIREBASE_*` variables
4. Redeploy the application

### After Deployment
1. Get your Vercel URL (e.g., `your-app.vercel.app`)
2. Add it to Firebase Console authorized domains (see Step 2 above)
3. Test Google OAuth on production

## 🐛 Common Issues & Solutions

### Issue: "Google Sign-In is not enabled"
**Solution**: Go to Firebase Console → Authentication → Sign-in method → Enable Google

### Issue: "Unauthorized domain"
**Solution**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Issue: "Can't access upload page"
**Solution**: Make sure you're logged in. The page now requires authentication.

### Issue: "Username and display name are the same"
**Solution**: This has been fixed. Username is stored separately from displayName in Firestore.

### Issue: "Not staying logged in"
**Solution**: Make sure to check "Remember Me" when logging in.

## 📝 User Flow Summary

### For New Users (Email/Password)
1. Go to `/signup`
2. Enter Display Name, Username, Email, Password
3. Click Sign Up
4. → Automatically logged in and redirected to home
5. Username shows in navbar

### For New Users (Google OAuth)
1. Go to `/signup` or `/login`
2. Click "Continue with Google"
3. Select Google account
4. **Username modal appears**
5. Enter username (3-20 chars)
6. Click Continue
7. → Logged in and redirected to home
8. Username shows in navbar

### For Returning Users
1. Go to `/login`
2. Enter email/password OR click Google
3. Toggle Remember Me if desired
4. Click Sign In
5. → Logged in and redirected to home
6. Username shows in navbar with dropdown menu

## 🎯 Next Steps

1. **Test locally first** - Make sure everything works on localhost
2. **Enable Google Sign-In in Firebase Console** (Step 1 above)
3. **Deploy to Vercel** with environment variables
4. **Add Vercel domain** to Firebase authorized domains
5. **Test on production** with real Google account

## 💡 Features Now Working

✅ Email/Password authentication
✅ Google OAuth authentication
✅ Username creation for new users
✅ Display Name separate from Username
✅ Remember Me functionality
✅ Protected upload route
✅ Username display in navbar
✅ User dropdown with sign out
✅ Offline persistence
✅ Graceful error handling

## 📊 Database Structure

When a user signs up or creates a username, this is stored in Firestore:

```javascript
// Collection: users
// Document ID: {userId}
{
  username: "johndoe",           // Unique identifier
  displayName: "John Doe",       // Full name
  email: "john@example.com",     // Email address
  createdAt: "2025-12-07T..."    // Timestamp
}
```

The navbar fetches the `username` field and displays it as `@username`.
