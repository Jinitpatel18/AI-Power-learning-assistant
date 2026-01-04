# 🚀 Deploy Your App in 5 Minutes - Get Live Link!

## Method 1: Deploy via Vercel Web Interface (EASIEST - No CLI needed!)

### Step 1: Deploy Backend (2 minutes)

1. **Go to**: https://vercel.com/new
2. **Sign up/Login** with GitHub
3. **Import your repository**: `Jinitpatel18/AI-Power-learning-assistant`
4. **Configure Backend**:
   - **Root Directory**: Click "Edit" → Set to `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (or `npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   MONGODB_URI = your_mongodb_connection_string
   JWT_SECRET = any_random_string_like_mySecret123!
   GEMINI_API_KEY = your_gemini_api_key
   NODE_ENV = production
   ```
6. **Click "Deploy"**
7. **Wait 2-3 minutes** → Copy your backend URL (e.g., `https://ai-power-learning-assistant-backend.vercel.app`)

---

### Step 2: Deploy Frontend (2 minutes)

1. **Go to**: https://vercel.com/new (or click "Add New Project")
2. **Import the same repository**: `Jinitpatel18/AI-Power-learning-assistant`
3. **Configure Frontend**:
   - **Root Directory**: Click "Edit" → Set to `frontend/ai-learning assistant`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install`
4. **Add Environment Variable**:
   ```
   VITE_API_URL = your_backend_url_from_step_1
   ```
   (Example: `https://ai-power-learning-assistant-backend.vercel.app`)
5. **Click "Deploy"**
6. **Wait 2-3 minutes** → **YOU GET YOUR LIVE LINK!** 🎉

---

## Method 2: Quick CLI Deployment

If you prefer command line:

### Backend:
```bash
cd backend
npx vercel --prod
# Follow prompts, add env vars in Vercel dashboard
```

### Frontend:
```bash
cd "frontend/ai-learning assistant"
npx vercel --prod
# Add VITE_API_URL in Vercel dashboard
```

---

## 🔑 Get Your Required Keys (Free):

### MongoDB Atlas (Free Database):
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create account → Create free cluster
3. Database Access → Create user (save username/password)
4. Network Access → Add IP: `0.0.0.0/0`
5. Click "Connect" → "Connect your application"
6. Copy connection string → Replace `<password>` with your password
7. Use as `MONGODB_URI`

### Google Gemini API Key (Free):
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key → Use as `GEMINI_API_KEY`

---

## ✅ After Deployment:

1. **Your Frontend URL**: `https://your-app.vercel.app` ← **ADD THIS TO YOUR RESUME!**
2. **Test your app**: Register, login, upload document, test AI features
3. **Share the link**: It's live and public!

---

## 🎯 That's It! You'll have a live link in ~5 minutes!

**Need help?** The Vercel interface is very user-friendly - just follow the prompts!



