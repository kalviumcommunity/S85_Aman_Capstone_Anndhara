# CORS Issue Fix Guide for Anndhara Project

## Problem Description
You're experiencing a CORS (Cross-Origin Resource Sharing) error when trying to connect to your Socket.IO backend from your local development environment. The error indicates that your backend is only allowing requests from `https://anndhara.netlify.app/` but blocking requests from `http://localhost:5173`.

## Root Cause
The issue is likely that your deployed backend on Render is not properly applying the CORS configuration that allows localhost origins during development.

## Solutions Applied

### 1. Backend Server Updates (server.js)
- ✅ Enhanced CORS configuration with better logging
- ✅ Added development mode detection
- ✅ Improved error handling and debugging
- ✅ More robust origin validation

### 2. Frontend Updates
- ✅ Socket.IO configuration now tries localhost first in development
- ✅ API helper now uses localhost in development
- ✅ Added fallback to production URLs if localhost fails
- ✅ Better error handling and reconnection logic

## Immediate Steps to Fix

### Step 1: Deploy Updated Backend
1. Commit and push your updated `backend/server.js` to your repository
2. Redeploy your backend on Render
3. Ensure the deployment completes successfully

### Step 2: Test Local Development
1. Start your local backend: `cd backend && npm start`
2. Start your local frontend: `cd frontend && npm run dev`
3. Check browser console for connection logs

### Step 3: Verify CORS Headers
After deployment, check that your backend is sending proper CORS headers by inspecting the network tab in your browser's developer tools.

## Environment Configuration

### Backend (.env file - create this)
```bash
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PORT=9001
```

### Frontend (already configured)
The frontend now automatically detects the environment and uses appropriate URLs.

## Development vs Production URLs

### Development
- Backend: `http://localhost:9001`
- Frontend: `http://localhost:5173`

### Production
- Backend: `https://anndhara.onrender.com`
- Frontend: `https://anndhara.netlify.app`

## Testing the Fix

1. **Local Development Test:**
   - Backend should be running on port 9001
   - Frontend should connect to localhost:9001
   - Check console for "✅ Socket connected successfully"

2. **Production Test:**
   - Deploy frontend to Netlify
   - Should connect to anndhara.onrender.com
   - No CORS errors should occur

## Troubleshooting

### If CORS still occurs:
1. Check Render deployment logs for any errors
2. Verify the backend is actually running the updated code
3. Check if there are any environment variables overriding CORS settings
4. Ensure your Render service is configured to use the latest commit

### If localhost connection fails:
1. Ensure your local backend is running on port 9001
2. Check firewall settings
3. The frontend will automatically fallback to production URL

## Additional Notes

- The updated configuration includes comprehensive logging for debugging
- Development mode automatically allows all localhost origins
- Production mode strictly enforces allowed origins
- Socket.IO will try WebSocket first, then fallback to polling

## Next Steps

1. Deploy the updated backend
2. Test local development
3. Test production deployment
4. Monitor logs for any remaining issues

If problems persist, check the Render deployment logs and ensure all environment variables are properly set. 