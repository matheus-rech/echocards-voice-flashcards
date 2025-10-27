# EchoCards - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option A: With Backend Security (Recommended)

```bash
# 1. Install dependencies for both frontend and backend
npm install
cd server && npm install && cd ..

# 2. Configure backend API key
cd server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY from https://aistudio.google.com/app/apikey

# 3. Start backend (Terminal 1)
npm start

# 4. Start frontend (Terminal 2)
cd ..
npm run dev

# 5. Switch to secure backend proxy
mv services/geminiService.ts services/geminiService.original.ts
mv services/geminiServiceProxy.ts services/geminiService.ts

# 6. Open http://localhost:3000
```

### Option B: Quick Test (Insecure - Dev Only)

```bash
# 1. Install frontend dependencies
npm install

# 2. Add API key to .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Start frontend
npm run dev

# 4. Open http://localhost:3000

# ⚠️ WARNING: API key exposed in browser! Use Option A for production.
```

## 📁 Project Structure

```
echocards---voice-powered-flashcards/
├── server/                  # Backend API proxy (NEW - Phase 1)
│   ├── server.js           # Express server
│   ├── routes/gemini.js    # API endpoints
│   ├── middleware/         # Rate limiting, errors
│   └── .env                # Backend config (DO NOT COMMIT)
├── services/
│   ├── geminiService.ts    # Original (direct API)
│   ├── geminiServiceProxy.ts # Secure (via backend)
│   ├── storageService.ts   # localStorage management
│   ├── errorLoggingService.ts # Error tracking
│   └── toastService.tsx    # Toast notifications
├── components/             # React components
├── App.tsx                # Main app logic
└── index.tsx              # Entry point with error boundary
```

## 🎯 Key Features

### ✅ Implemented
- Voice-powered flashcard review with FSRS algorithm
- AI deck generation (topic or document-based)
- Image generation and analysis
- Audio transcription
- **Backend API proxy with rate limiting (Phase 1)**
- **Error boundaries and graceful failure handling (Phase 3)**

### ⏳ Coming Soon
- Data export/backup (Phase 2)
- User authentication (Phase 3)
- Automated testing (Phase 4)

## 🔒 Security Status

| Feature | Status |
|---------|--------|
| API Key Security | ✅ Backend proxy (Phase 1) |
| Rate Limiting | ✅ 100 req/15min standard, 10 req/15min strict |
| Error Handling | ✅ Comprehensive logging + toast notifications |
| CORS Protection | ✅ Whitelist-based |
| Input Validation | ⏳ Phase 2 |
| Authentication | ⏳ Phase 3 |

## 🛠️ Common Commands

### Development
```bash
# Frontend only
npm run dev

# Backend only
cd server && npm start

# Both (use 2 terminals)
cd server && npm start  # Terminal 1
npm run dev             # Terminal 2
```

### Production
```bash
# Build frontend
npm run build

# Deploy backend (Heroku example)
cd server
git push heroku main

# Deploy frontend (Vercel example)
vercel deploy
```

## 📚 Documentation

- **Backend Setup:** [BACKEND_SETUP.md](BACKEND_SETUP.md) - Complete backend guide
- **Phase 1 Summary:** [PHASE1_IMPLEMENTATION_SUMMARY.md](PHASE1_IMPLEMENTATION_SUMMARY.md) - Security implementation
- **Error Handling:** [ERROR_HANDLING_SUMMARY.md](ERROR_HANDLING_SUMMARY.md) - Error system overview
- **Main Docs:** [CLAUDE.md](CLAUDE.md) - Architecture and patterns

## 🐛 Troubleshooting

### Backend shows "API Key not configured"
```bash
# Check .env file exists and has key
cat server/.env | grep GEMINI_API_KEY

# Should see: GEMINI_API_KEY=your_actual_key
```

### CORS error in browser
```bash
# Check ALLOWED_ORIGINS in server/.env
echo "ALLOWED_ORIGINS=http://localhost:3000" >> server/.env

# Restart backend
cd server && npm start
```

### Rate limit exceeded
Wait 15 minutes or adjust limits in `server/middleware/rateLimit.js`

## 🎓 Next Steps

1. ✅ **Complete Phase 1:** Backend security (DONE)
2. **Start Phase 2:** Data export/backup
3. **Add Phase 3:** User authentication
4. **Deploy:** Choose hosting platform

## 💡 Tips

- **Always run backend first** before frontend
- **Use `npm run dev`** for auto-restart during development
- **Check both consoles** (frontend + backend) for errors
- **Test with curl** to verify backend endpoints

## 🆘 Need Help?

1. Check troubleshooting sections in documentation
2. Review backend console logs
3. Test backend health: `curl http://localhost:3001/health`
4. Verify API key: `curl http://localhost:3001/api/gemini/health`

---

**Ready to build? Start with Option A above! 🚀**
