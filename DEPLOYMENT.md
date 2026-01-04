# Deployment Guide for AI-Powered Learning Assistant

This guide will help you deploy your application so you can add a public link to your resume.

## 🚀 Quick Deployment Options

### Option 1: Deploy with Vercel (Recommended - Free & Easy)

#### Backend Deployment (Vercel)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy backend**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked to link to existing project, say "No"
   - Project name: `ai-learning-assistant-backend` (or your choice)
   - Directory: `./` (current directory)

5. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project on [vercel.com](https://vercel.com)
   - Navigate to Settings → Environment Variables
   - Add these variables:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - A random secret string for JWT tokens
     - `GEMINI_API_KEY` - Your Google Gemini API key
     - `NODE_ENV` - Set to `production`
     - `PORT` - Vercel will handle this automatically

6. **Redeploy after adding environment variables**:
   ```bash
   vercel --prod
   ```

7. **Copy your backend URL** (e.g., `https://ai-learning-assistant-backend.vercel.app`)

#### Frontend Deployment (Vercel)

1. **Navigate to frontend folder**:
   ```bash
   cd "frontend/ai-learning assistant"
   ```

2. **Create `vercel.json` in frontend**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "installCommand": "npm install"
   }
   ```

3. **Deploy frontend**:
   ```bash
   vercel
   ```

4. **Set Environment Variable in Vercel Dashboard**:
   - Go to your frontend project on Vercel
   - Navigate to Settings → Environment Variables
   - Add: `VITE_API_URL` = Your backend URL from step 7 above
   - Example: `https://ai-learning-assistant-backend.vercel.app`

5. **Redeploy frontend**:
   ```bash
   vercel --prod
   ```

6. **Your frontend will be live!** (e.g., `https://ai-learning-assistant.vercel.app`)

---

### Option 2: Deploy with Render (Alternative - Free)

#### Backend on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ai-learning-assistant-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
5. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`
6. Deploy and copy the URL

#### Frontend on Render or Netlify

**Using Netlify (Easier for frontend):**

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `frontend/ai-learning assistant`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = Your Render backend URL
6. Deploy

---

### Option 3: Deploy with Railway (All-in-One)

1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Add two services:
   - **Backend Service**: Point to `backend` folder
   - **Frontend Service**: Point to `frontend/ai-learning assistant` folder
4. Set environment variables for each service
5. Deploy both services

---

## 📝 Pre-Deployment Checklist

### Backend Requirements:
- [ ] MongoDB database (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for free cloud database)
- [ ] Google Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
- [ ] JWT secret (generate a random string)
- [ ] All environment variables set

### Frontend Requirements:
- [ ] Backend URL configured in environment variables
- [ ] Build command works locally (`npm run build`)

---

## 🔧 MongoDB Atlas Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs during development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
6. Use this as your `MONGODB_URI`

---

## 🎯 After Deployment

1. **Test your deployed application**:
   - Visit your frontend URL
   - Try registering/logging in
   - Test uploading a document
   - Test AI features

2. **Update CORS settings** (if needed):
   - In `backend/server.js`, update the `origin` in CORS to your frontend URL:
   ```javascript
   origin: process.env.FRONTEND_URL || "https://your-frontend-url.vercel.app"
   ```

3. **Add to your resume**:
   - Frontend URL: `https://your-app.vercel.app`
   - GitHub Repository: `https://github.com/yourusername/your-repo`

---

## 🐛 Troubleshooting

### Backend Issues:
- **MongoDB Connection Error**: Check your `MONGODB_URI` and ensure IP is whitelisted
- **Port Error**: Vercel/Render handle ports automatically, don't set PORT manually
- **File Upload Issues**: Consider using cloud storage (AWS S3, Cloudinary) for production

### Frontend Issues:
- **API Connection Error**: Check `VITE_API_URL` environment variable
- **Build Errors**: Run `npm run build` locally first to catch errors
- **CORS Errors**: Update backend CORS settings to include your frontend URL

---

## 📞 Need Help?

If you encounter issues:
1. Check deployment logs in your hosting platform
2. Verify all environment variables are set correctly
3. Test API endpoints using Postman or curl
4. Check browser console for frontend errors

---

**Good luck with your deployment! 🚀**



