# Vercel Deployment Guide for EchoCards

## 🚀 Quick Deploy (5 Minutes)

Deploy EchoCards to Vercel for **full functionality** (frontend + backend + AI features).

### Why Vercel?

- ✅ **Full functionality** - All features work (voice, AI, multimodal)
- ✅ **Automatic HTTPS** - Secure by default
- ✅ **Environment variables** - API keys secured server-side
- ✅ **Serverless backend** - Express app runs as serverless functions
- ✅ **Auto-deploy** - Every git push triggers deployment
- ✅ **Free tier** - Generous limits for personal projects

---

## 📋 Prerequisites

1. **GitHub repository** - Already done ✅ (this repo)
2. **Vercel account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **Google Gemini API key** - Get from [aistudio.google.com](https://aistudio.google.com/apikey)

---

## 🎯 Deployment Steps

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select **`echocards-voice-flashcards`** repository
5. Click **"Import"**

### Step 2: Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 3: Add Environment Variables

**CRITICAL:** Add your API key before deploying!

1. In the Vercel project settings, go to **"Environment Variables"**
2. Add the following variable:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `GEMINI_API_KEY` | `your_actual_api_key_here` | Production, Preview, Development |

3. **(Optional)** Add CORS configuration:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `ALLOWED_ORIGINS` | `https://your-vercel-url.vercel.app` | Production |

   **Note:** The backend is already configured to allow Vercel deployments by default.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build and deployment
3. Get your URL: `https://echocards-voice-flashcards.vercel.app`

---

## ✅ Verify Deployment

### 1. Check Frontend

Visit your Vercel URL: `https://your-project.vercel.app`

**Expected:** EchoCards welcome screen loads

### 2. Check Backend API

Visit: `https://your-project.vercel.app/api/health`

**Expected:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-27T...",
  "environment": "production",
  "apiKeyConfigured": true
}
```

### 3. Test Voice Features

1. Click **"Start Session"** on the app
2. Say: **"Start review World Capitals"**
3. Voice recognition should work ✅

### 4. Test AI Features

1. Click **"Smart Create Deck"**
2. Generate a deck from topic
3. AI should create flashcards ✅

---

## 🔧 Troubleshooting

### Issue: "API Key not configured"

**Solution:**
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Verify `GEMINI_API_KEY` is set
- Redeploy the project

### Issue: "CORS Error"

**Solution:**
- The backend is configured to allow `*.vercel.app` domains by default
- If using a custom domain, add it to `ALLOWED_ORIGINS` environment variable
- Format: `https://yourdomain.com,https://www.yourdomain.com`

### Issue: "Backend not responding"

**Solution:**
- Check `/api/health` endpoint
- Verify `api/index.js` was deployed
- Check Vercel function logs in dashboard

### Issue: "Build failed"

**Solution:**
- Check build logs in Vercel dashboard
- Verify `package.json` has correct dependencies
- Ensure `npm run build` works locally

---

## 📊 Vercel Configuration Files

The repository includes these Vercel-specific files:

### `vercel.json`
Configures build and routing:
- Frontend: Vite static build → `/dist`
- Backend: Serverless functions → `/api`
- Routes: `/api/*` → serverless, everything else → static

### `api/index.js`
Serverless function wrapper for Express backend:
- Imports Express app configuration
- Exports for Vercel serverless environment
- Includes CORS for Vercel domains

### `.vercelignore`
Excludes unnecessary files from deployment:
- `node_modules` (rebuilt on Vercel)
- `.env` files (use environment variables)
- Documentation (except README)

---

## 🔐 Security Best Practices

### Environment Variables

- ✅ **NEVER commit** `.env` files to git
- ✅ **Always use** Vercel environment variables for API keys
- ✅ **Separate keys** for production vs. development
- ✅ **Rotate keys** if accidentally exposed

### CORS Configuration

- ✅ Backend allows only Vercel domains by default
- ✅ Add custom domains to `ALLOWED_ORIGINS` if needed
- ✅ Don't use `*` (allow all) in production

### Rate Limiting

- ✅ Backend includes rate limiting (100 req/15min)
- ✅ Strict limit for expensive operations (images: 10 req/15min)
- ✅ Adjust in `server/middleware/rateLimit.js` if needed

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `echocards.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://echocards.yourdomain.com
   ```
5. Redeploy

---

## 🔄 Automatic Deployments

### Production Deployments

- **Trigger:** Push to `main` branch
- **URL:** `https://echocards-voice-flashcards.vercel.app`
- **Environment:** Production environment variables

### Preview Deployments

- **Trigger:** Push to any other branch or pull request
- **URL:** `https://echocards-voice-flashcards-<branch>.vercel.app`
- **Environment:** Preview environment variables
- **Use case:** Test features before merging

---

## 📈 Monitoring & Analytics

### Vercel Dashboard

- **Deployments:** View build logs and status
- **Functions:** Monitor serverless function performance
- **Analytics:** Track page views and performance
- **Logs:** Real-time function logs

### Useful Metrics

- **Build time:** ~1-2 minutes typical
- **Cold start:** <1 second for serverless functions
- **Function execution:** <5 seconds typical for AI operations

---

## 💰 Cost Considerations

### Free Tier Limits

- **Bandwidth:** 100 GB/month
- **Builds:** Unlimited
- **Functions:** 100 GB-hours/month
- **Perfect for:** Personal projects, portfolios, demos

### API Costs (Google Gemini)

- **Voice:** ~$0.01 per minute
- **Deck generation:** ~$0.10 per deck
- **Image generation:** ~$0.04 per image
- **Estimated:** $1-5/month for moderate use

---

## 🚀 Performance Optimizations

### Already Implemented

- ✅ **Compression:** Gzip enabled on backend
- ✅ **Caching:** Static assets cached automatically
- ✅ **Code splitting:** Vite handles automatically
- ✅ **Edge network:** Vercel CDN for fast global delivery

### Optional Improvements

- [ ] Add service worker for offline mode
- [ ] Implement Redis caching for API responses
- [ ] Add CDN for screenshots and media
- [ ] Enable Vercel Analytics

---

## 📞 Support

### Deployment Issues

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues:** [Report here](https://github.com/matheus-rech/echocards-voice-flashcards/issues)

### App Issues

- **Documentation:** Check other `.md` files in repo
- **Demo Guide:** See `DEMO_GUIDE.md` for testing
- **Quick Start:** See `QUICK_START.md` for local setup

---

## ✨ Success Checklist

After deployment, verify:

- [ ] Frontend loads at Vercel URL
- [ ] `/api/health` returns `"status": "healthy"`
- [ ] API key configured: `"apiKeyConfigured": true`
- [ ] Voice recognition works
- [ ] AI deck generation works
- [ ] Image features work
- [ ] No CORS errors in browser console
- [ ] No API key exposed in browser DevTools

---

## 🎉 You're Done!

Your EchoCards app is now:
- ✅ **Live** on the internet
- ✅ **Secure** with environment variables
- ✅ **Scalable** with serverless functions
- ✅ **Production-ready** for real users

**Share your deployment:**
- Portfolio: Add to your personal website
- Resume: Include as a project
- Social: Share on Twitter, LinkedIn
- Community: Post on Reddit, ProductHunt

---

**Deployed URL:** `https://echocards-voice-flashcards.vercel.app`

🚀 **Generated with [Claude Code](https://claude.com/claude-code)**
