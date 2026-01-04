# 🚀 Quick Deployment Guide

## Step 1: Deploy Backend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel login
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add:
     - `MONGODB_URI` = Your MongoDB connection string
     - `JWT_SECRET` = Any random string (e.g., `mySecretKey123!`)
     - `GEMINI_API_KEY` = Your Google Gemini API key
     - `NODE_ENV` = `production`

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

5. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

---

## Step 2: Deploy Frontend to Vercel

1. **Deploy Frontend**:
   ```bash
   cd "frontend/ai-learning assistant"
   vercel
   ```

2. **Add Environment Variable in Vercel Dashboard**:
   - `VITE_API_URL` = Your backend URL from Step 1

3. **Redeploy**:
   ```bash
   vercel --prod
   ```

4. **Your app is live!** 🎉

---

## Step 3: Get MongoDB (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create cluster
3. Create database user
4. Network Access → Add IP `0.0.0.0/0` (allow all)
5. Get connection string → Use as `MONGODB_URI`

---

## Step 4: Get Gemini API Key (Free)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Use as `GEMINI_API_KEY`

---

## ✅ Done!

Your app URL: `https://your-frontend.vercel.app`

Add this to your resume! 🎯



