# OpenArms - Deployment Setup

## Local Development Setup

### 1. Backend Flask Server
The Python backend now runs as a Flask API server instead of being called via child_process.

**Setup:**
```bash
cd backend
pip install flask
python app.py
```

The backend will run on `http://localhost:5000`

### 2. Frontend (Vercel Deployment)

**Environment Variables in Vercel Dashboard:**
- Go to your Vercel project settings
- Add environment variable: `BACKEND_URL=https://your-backend-url.com`
  (or your actual backend URL)

**For Local Testing:**
- The `.env.local` file is already set to `BACKEND_URL=http://localhost:5000`
- Run: `npm run dev` in the `frontend` directory
- Frontend will be at `http://localhost:3000`

### 3. Keep Backend Running

Your backend needs to be running for the frontend to work:

**Option A: Local Machine (During Development)**
```bash
cd backend
python app.py
# Keep this terminal running while developing
```

**Option B: Deploy Backend (For Production)**
- Deploy backend to Railway, Render, or Heroku
- Update `BACKEND_URL` environment variable in Vercel to your deployed backend URL

## Architecture

```
Frontend (Vercel) 
    ↓ API calls to
Backend (Your Server/Machine)
    ↓ runs
Python Scripts (Demucs, Librosa)
```

## Important Notes

1. **Vercel Frontend**: Uses Next.js API routes as proxies to forward requests to your backend
2. **Flask Backend**: Handles file uploads and runs Python processing (Demucs, Librosa)
3. **Environment Variables**: Must set `BACKEND_URL` in Vercel dashboard

## Testing

1. Start backend: `python backend/app.py`
2. Start frontend: `npm run dev` (in frontend directory)
3. Go to `http://localhost:3000`
4. Test stem splitter or tempo analyzer

If you see errors, check:
- Backend is running on port 5000
- `BACKEND_URL` is correctly set
- Network connectivity between frontend and backend
