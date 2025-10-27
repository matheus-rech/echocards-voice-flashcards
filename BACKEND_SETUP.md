# Backend API Proxy Setup Guide

## 🎯 Why Backend Proxy?

The backend proxy solves **critical security issues**:

### Before (Client-Side API Key):
- ❌ API key visible in browser DevTools
- ❌ Anyone can extract and abuse your key
- ❌ No rate limiting or cost control
- ❌ Unlimited API quota consumption
- ❌ Not production-ready

### After (Backend Proxy):
- ✅ API key secured on server
- ✅ Rate limiting per IP address
- ✅ Cost control and monitoring
- ✅ Request logging and analytics
- ✅ Production-ready architecture

## 📁 Backend Structure

```
server/
├── package.json           # Backend dependencies
├── server.js             # Express server entry point
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Template for environment variables
├── routes/
│   └── gemini.js         # Gemini API proxy routes
└── middleware/
    ├── rateLimit.js      # Rate limiting configuration
    └── errorHandler.js   # Error handling middleware
```

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- `express` - Web server framework
- `express-rate-limit` - Rate limiting middleware
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `helmet` - Security headers
- `compression` - Response compression

### Step 2: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Gemini API key
nano .env  # or use your preferred editor
```

**Required Configuration:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
```

**Get Your API Key:**
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env`

### Step 3: Start the Backend Server

```bash
# From server/ directory
npm start

# Or for auto-restart during development
npm run dev
```

You should see:
```
==================================================
🚀 EchoCards Backend Server
==================================================
📡 Server running on: http://localhost:3001
🌍 Environment: development
🔑 API Key configured: ✅
🛡️  CORS allowed origins: http://localhost:3000
⏱️  Rate limit: 100 requests per 15 minutes
==================================================

✨ Ready to accept requests!
```

### Step 4: Start the Frontend (in another terminal)

```bash
# From project root directory
npm run dev
```

Frontend will run on `http://localhost:3000` and automatically proxy API requests to backend at `http://localhost:3001`.

### Step 5: Activate Backend Proxy in Frontend

**Option A: Rename the file (recommended)**
```bash
# Backup original service
mv services/geminiService.ts services/geminiService.original.ts

# Use proxy version
mv services/geminiServiceProxy.ts services/geminiService.ts
```

**Option B: Update imports in App.tsx**
```typescript
// Change this:
import { geminiService } from './services/geminiService';

// To this:
import { geminiService } from './services/geminiServiceProxy';
```

## 🛡️ Security Features

### 1. Rate Limiting

**Standard Endpoints** (100 requests / 15 minutes per IP):
- `/api/gemini/generate-content`
- `/api/gemini/tts`

**Strict Endpoints** (10 requests / 15 minutes per IP):
- `/api/gemini/generate-image`
- `/api/gemini/deck-generation`

**When Rate Limit Exceeded:**
```json
{
  "error": "Too many requests",
  "message": "You have exceeded the rate limit. Please try again later.",
  "retryAfter": "5 minutes"
}
```

### 2. CORS Protection

Only allowed origins (configured in `.env`) can access the API.

**Default:** `http://localhost:3000`
**Production:** Add your production domain to `ALLOWED_ORIGINS`

```env
# Multiple origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 3. Security Headers (Helmet.js)

Automatically adds security headers:
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security`
- And more...

### 4. Request Logging

All requests are logged with:
- Method and path
- Status code
- Response time
- Error details (if any)

Example log:
```
[INFO] POST /api/gemini/tts 200 234ms
[ERROR] POST /api/gemini/generate-image 429 12ms
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### Gemini Health
```
GET /api/gemini/health
```
Response:
```json
{
  "status": "ok",
  "apiKeyConfigured": true,
  "timestamp": "2025-01-27T12:00:00.000Z"
}
```

### Text-to-Speech
```
POST /api/gemini/tts
Content-Type: application/json

{
  "text": "Hello, world!",
  "voiceName": "Zephyr"
}
```

### Generate Content (Explanations, Analysis)
```
POST /api/gemini/generate-content
Content-Type: application/json

{
  "model": "gemini-2.5-pro",
  "contents": [{"parts": [{"text": "Explain quantum physics"}]}],
  "config": {}
}
```

### Deck Generation
```
POST /api/gemini/deck-generation
Content-Type: application/json

{
  "topic": "Machine Learning",
  "depth": "Intermediate",
  "numberOfCards": 10
}
```

### Image Generation
```
POST /api/gemini/generate-image
Content-Type: application/json

{
  "prompt": "A sunset over mountains",
  "config": {
    "numberOfImages": 1,
    "aspectRatio": "1:1"
  }
}
```

## ⚙️ Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | *Required* | Your Gemini API key |
| `PORT` | `3001` | Backend server port |
| `NODE_ENV` | `development` | Environment (development/production) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins |
| `LOG_LEVEL` | `info` | Logging level |

### Rate Limit Customization

Edit `server/middleware/rateLimit.js`:

```javascript
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 50,                    // 50 requests per window
  // ...
});
```

### CORS Customization

Edit `server/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://yourdomain.com',
  'https://app.yourdomain.com'
];
```

## 🐛 Troubleshooting

### Issue: "API Key not configured"

**Symptom:** Backend shows `🔑 API Key configured: ❌`

**Solution:**
1. Check `server/.env` exists
2. Verify `GEMINI_API_KEY` is set (not `PLACEHOLDER_API_KEY`)
3. Restart the backend server

### Issue: "CORS Error"

**Symptom:** Browser console shows "blocked by CORS policy"

**Solution:**
1. Check backend logs for blocked origin
2. Add your frontend URL to `ALLOWED_ORIGINS` in `server/.env`
3. Restart backend

### Issue: "Connection Refused"

**Symptom:** Frontend can't connect to backend

**Solution:**
1. Verify backend is running: `http://localhost:3001/health`
2. Check `PORT` in `server/.env` matches Vite proxy config
3. Restart both servers

### Issue: "Rate Limit Exceeded"

**Symptom:** 429 status code, "Too many requests"

**Solution:**
1. Wait for rate limit window to reset (check `retryAfter` in response)
2. Adjust rate limits in `server/middleware/rateLimit.js`
3. For testing, temporarily increase limits

### Issue: "Live API Still Uses Client Key"

**Note:** The Live API (for real-time voice) still requires the API key on the client side because it uses WebSocket connections that can't be easily proxied.

**Temporary Workaround:** Keep API key in `.env.local` for Live API only

**Future Fix:** Implement WebSocket proxy server (advanced)

## 📊 Monitoring

### View Request Logs

Backend logs all requests to console:
```
[INFO] POST /api/gemini/tts 200 234ms
[INFO] POST /api/gemini/deck-generation 200 5678ms
```

### Check Rate Limit Status

Monitor console for rate limit warnings:
```
Rate limit exceeded for IP: ::ffff:127.0.0.1
```

### Export Error Logs

Frontend error logs are stored in localStorage:
```javascript
// In browser console
const logs = localStorage.getItem('echoCards_errorLogs');
console.log(JSON.parse(logs));
```

## 🚀 Production Deployment

### 1. Choose a Hosting Platform

**Backend Options:**
- **Heroku** - Easy deployment, free tier available
- **Railway** - Modern platform, simple setup
- **Render** - Auto-deploy from GitHub
- **DigitalOcean** - Full control, App Platform
- **AWS EC2** - Maximum flexibility

### 2. Set Environment Variables

On your hosting platform, set:
```
GEMINI_API_KEY=your_production_key
NODE_ENV=production
PORT=3001 (or auto-assigned by platform)
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=50 (lower for production)
```

### 3. Deploy Backend

Example with Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy
cd server
railway up
```

### 4. Update Frontend

Update `vite.config.ts` proxy target:
```typescript
proxy: {
  '/api': {
    target: 'https://your-backend-url.com',
    changeOrigin: true,
    secure: true,
  }
}
```

### 5. Deploy Frontend

Use Vercel, Netlify, or Cloudflare Pages:
```bash
npm run build
# Upload dist/ folder
```

## 📈 Cost Optimization

### Gemini API Pricing (as of 2025)

**Text Generation:**
- Gemini 2.5 Flash: $0.075 / 1M input tokens, $0.30 / 1M output tokens
- Gemini 2.5 Pro: $1.25 / 1M input tokens, $5.00 / 1M output tokens

**Image Generation:**
- Imagen 4.0: $0.04 per image

### Cost Control Strategies

1. **Rate Limiting** - Already implemented (100 req / 15 min)
2. **Caching** - Cache common responses (future enhancement)
3. **Request Quotas** - Per-user monthly limits (requires auth)
4. **Model Selection** - Use Flash for simple tasks, Pro for complex
5. **Monitoring** - Track usage via backend logs

### Estimated Monthly Costs (100 users)

**Conservative Usage:**
- 100 users × 10 sessions/month × 20 cards/session = 20,000 API calls
- ~10,000 TTS calls × $0.001 = $10
- ~5,000 content generation × $0.01 = $50
- ~500 deck generations × $0.10 = $50
- ~100 images × $0.04 = $4

**Total: ~$114/month**

## 🔐 Security Best Practices

1. **Never Commit `.env` Files**
   - Already in `.gitignore`
   - Use `.env.example` for templates

2. **Rotate API Keys Regularly**
   - Every 90 days or after team member leaves
   - Generate new key at https://aistudio.google.com/app/apikey

3. **Monitor for Abuse**
   - Check backend logs daily
   - Set up alerts for unusual activity

4. **Use HTTPS in Production**
   - Required for secure communication
   - Let's Encrypt for free SSL certificates

5. **Implement Authentication** (Phase 3)
   - Per-user rate limiting
   - Request tracking and auditing
   - Quota management

## 🎓 Next Steps

✅ **Phase 1 Complete:** Backend proxy with rate limiting

**Next Phases:**
- **Phase 2:** Data export/backup system
- **Phase 3:** Authentication and user accounts
- **Phase 4:** Testing and CI/CD
- **Phase 5:** Production deployment

**Advanced Features:**
- WebSocket proxy for Live API
- Redis for distributed rate limiting
- Request caching
- API analytics dashboard
- User authentication (Firebase/Auth0)

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Rate Limiting Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 💡 Tips

- **Development:** Use `npm run dev` for auto-restart
- **Production:** Use PM2 for process management
- **Debugging:** Check both frontend and backend console logs
- **Testing:** Use `curl` or Postman to test endpoints directly

## 🆘 Need Help?

If you encounter issues:
1. Check troubleshooting section above
2. Review backend console logs
3. Verify `.env` configuration
4. Test backend health endpoint
5. Check CORS and rate limit settings

---

**Made secure with ❤️ for EchoCards**
