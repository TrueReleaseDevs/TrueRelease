# TrueRelease Deployment Guide

## Overview
This document outlines the deployment configuration for **TrueRelease**, deployed with:
- **Frontend**: Netlify → `https://spotifyv21.netlify.app/`
- **Backend**: Render → `https://truerelease.onrender.com/`

---

## Changes Made

### 1. Branding Updates
All references to "Spotify Updater" have been updated to "TrueRelease":
- ✅ `index.html` - Page title
- ✅ `Navbar.jsx` - Logo text
- ✅ `Footer.jsx` - Logo and copyright
- ✅ `Features.jsx` - Section heading
- ✅ `package.json` - Package name

### 2. Backend URL Updates
Updated all localhost references to production URLs:

#### Frontend → Backend Communication:
- ✅ `Navbar.jsx` - Login buttons now point to `https://truerelease.onrender.com/login`
- ✅ `TagView.jsx` - API calls now point to `https://truerelease.onrender.com/run_update`

#### Backend → Frontend Redirects:
- ✅ `backend/app.py` - OAuth callback now redirects to `https://spotifyv21.netlify.app/`

---

## Environment Variables Setup

### For Render (Backend)

You need to set these environment variables in your Render dashboard:

```bash
SPOTIPY_CLIENT_ID=<your_spotify_client_id>
SPOTIPY_CLIENT_SECRET=<your_spotify_client_secret>
SPOTIPY_REDIRECT_URI=https://truerelease.onrender.com/callback
```

**Steps to set on Render:**
1. Go to your Render dashboard
2. Select your **TrueRelease** service
3. Navigate to **Environment** tab
4. Add the three environment variables above
5. Click **Save Changes**
6. Render will automatically redeploy

### Spotify Developer Dashboard Configuration

You also need to update your Spotify App settings:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your application
3. Click **Edit Settings**
4. Under **Redirect URIs**, add:
   ```
   https://truerelease.onrender.com/callback
   ```
5. Click **Save**

> **Note**: You can keep `http://localhost:5000/callback` for local development.

---

## Deployment Steps

### Frontend (Netlify)

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - If using Netlify CLI:
     ```bash
     netlify deploy --prod
     ```
   - Or push to your connected Git repository (automatic deployment)

### Backend (Render)

1. **Ensure all dependencies are in `requirements.txt`:**
   ```bash
   cd backend
   pip freeze > requirements.txt
   ```

2. **Push to Git repository:**
   ```bash
   git add .
   git commit -m "Update redirects for production deployment"
   git push origin main
   ```

3. **Render will automatically deploy** (if auto-deploy is enabled)

---

## Testing the Deployment

1. **Visit your frontend:** `https://spotifyv21.netlify.app/`
2. **Click "Sign in with Spotify"**
3. **Verify redirect flow:**
   - Should redirect to Spotify login
   - After login, should redirect back to your Netlify app with success message
4. **Test the Tags feature** (if logged in)
5. **Test "Change Account" button**

---

## Troubleshooting

### Issue: Login redirect not working
- **Check**: Spotify Developer Dashboard → Redirect URIs includes `https://truerelease.onrender.com/callback`
- **Check**: Render environment variables are set correctly

### Issue: CORS errors
- **Solution**: The backend may need CORS configuration if you see cross-origin errors
- Add to `backend/app.py`:
  ```python
  from flask_cors import CORS
  CORS(app, origins=["https://spotifyv21.netlify.app"])
  ```

### Issue: "INVALID_CLIENT" error
- **Check**: Environment variables on Render match your Spotify Developer Dashboard credentials
- **Check**: No extra spaces in environment variable values

---

## Local Development

To run locally, use different redirect URIs:

1. Create `backend/.env` with:
   ```bash
   SPOTIPY_CLIENT_ID=<your_client_id>
   SPOTIPY_CLIENT_SECRET=<your_client_secret>
   SPOTIPY_REDIRECT_URI=http://localhost:5000/callback
   ```

2. Update `Navbar.jsx` and `TagView.jsx` to use `http://localhost:5000` instead of production URLs

3. Update `backend/app.py` line 103 to redirect to `http://localhost:5173`

---

## Summary

✅ All redirects now point to production URLs
✅ App rebranded to "TrueRelease"
✅ Environment variables documented
✅ Deployment process outlined

**Next Steps:**
1. Set environment variables on Render
2. Update Spotify Developer Dashboard redirect URIs
3. Test the full authentication flow
4. Verify all features work in production
