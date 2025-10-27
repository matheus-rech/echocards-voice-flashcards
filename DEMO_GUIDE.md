# EchoCards Demo Guide - Live Testing Instructions

## ✅ System Status

### Backend Server
- **Status:** ✅ Running
- **Port:** 3001
- **API Key:** ✅ Configured and validated
- **Health:** http://localhost:3001/health
- **Rate Limiting:** 100 requests per 15 minutes

### Frontend Server
- **Status:** ✅ Running
- **Port:** 3000
- **URL:** http://localhost:3000
- **Also available at:** http://192.168.1.105:3000 (network access)

---

## 🎯 What to Test

### 1. **Open the Application**

**Action:** Open your browser and navigate to:
```
http://localhost:3000
```

**Expected Result:**
- Dark theme interface loads
- You see 2 default decks: "World Capitals" and "Cognitive Biases"
- Multiple action buttons visible at the top:
  - Generate Image
  - Analyze Image
  - Analyze Text
  - Transcribe Audio
  - Import Deck
  - Smart Create Deck
  - **Backup & Restore** (NEW!)

---

## 🎤 Voice Features Test (Primary Feature)

### Test 1: Voice Review
**Action:**
1. Click anywhere on the page to start voice session
2. Say: **"Start review World Capitals"**
3. Wait for AI to read the first card
4. Say: **"Show answer"**
5. Rate your knowledge: **"Good"** or **"Easy"** or **"Hard"** or **"Again"**

**Expected Result:**
- Microphone permission prompt appears (grant it)
- AI responds with voice and presents first card
- Answer reveals on command
- Card gets scheduled based on your rating
- Next card appears automatically

**Backend Verification:**
- Check Terminal 1 (backend) for API request logs
- You should see POST requests to `/api/gemini/*` endpoints

---

## 🤖 AI Deck Generation Test

### Test 2: Topic-Based Deck Creation
**Action:**
1. Click **"Smart Create Deck"** button
2. Fill in the form:
   - Topic: "Solar System"
   - Depth: "Intermediate"
   - Number of Cards: "5"
3. Click "Generate Deck from Topic"

**Expected Result:**
- AI generates 5 flashcards about the solar system
- Deck appears in the deck list
- Cards contain questions, answers, and explanations
- Takes 5-15 seconds to generate

**Backend Verification:**
- Check backend logs for `POST /api/gemini/deck-generation` request
- Should show 200 status code

### Test 3: Document-Based Deck Creation
**Action:**
1. Click **"Smart Create Deck"**
2. Switch to "Document" tab
3. Paste text (e.g., Wikipedia article about photosynthesis)
4. Enter deck name: "Photosynthesis"
5. Enter number of cards: "8"
6. Click "Generate Deck from Document"

**Expected Result:**
- AI analyzes the document
- Creates 8 flashcards from the content
- New deck appears in list

---

## 💾 Backup & Export Test (NEW - Phase 2)

### Test 4: Export to JSON
**Action:**
1. Click **"Backup & Restore"** button
2. Stay on "Export Data" tab
3. Select **JSON** format (should be selected by default)
4. Ensure "Include preferences" and "Include checksum" are checked
5. Click **"Export as JSON"**

**Expected Result:**
- File downloads: `echocards-backup-2025-10-27.json`
- Open the file in text editor
- Should contain:
  ```json
  {
    "version": "1.0",
    "exportDate": "2025-10-27T...",
    "decks": [...],
    "cards": [...],
    "studyProgress": {...},
    "preferences": {...},
    "checksum": "long_hash_string..."
  }
  ```
- Verify decks and cards are present
- Checksum should be 64 characters (SHA-256 hash)

### Test 5: Export to CSV
**Action:**
1. In Backup & Restore view
2. Select **CSV** format
3. Click **"Export as CSV"**

**Expected Result:**
- File downloads: `echocards-export-2025-10-27.csv`
- Open in Excel/Google Sheets
- Columns: Deck Name, Question, Answer, Explanation, Due Date, Stability, Difficulty, Lapses, Reps, State
- All cards from all decks exported

### Test 6: Export to Anki
**Action:**
1. In Backup & Restore view
2. Select **Anki** format
3. Click **"Export as Anki"**

**Expected Result:**
- File downloads: `echocards-anki-2025-10-27.txt`
- TSV format (tab-separated)
- Columns: Question [TAB] Answer [TAB] Explanation [TAB] Tags
- Can be imported into Anki app

---

## 📥 Import & Restore Test

### Test 7: Import JSON Backup (MERGE strategy)
**Action:**
1. First, export your data (Test 4 above)
2. Create a new card manually:
   - Say "Add a card to World Capitals"
   - Question: "What is the capital of Mars?"
   - Answer: "There is no capital on Mars"
3. Click **"Backup & Restore"**
4. Switch to **"Import Data"** tab
5. Click **"Choose file"** and select the JSON backup you exported earlier
6. Wait for validation (should show green "File is valid" message)
7. Select **"Merge"** strategy (default)
8. Click **"Import Data"**

**Expected Result:**
- Validation shows: ✓ File is valid and ready to import
- Import completes with success message
- Statistics show:
  - Decks Imported: 2
  - Cards Imported: 0 (all already exist)
  - Decks Skipped: 0
  - Cards Skipped: [number of cards]
- Page reloads automatically
- Your manual card ("Mars" question) still exists
- All original cards still exist

### Test 8: Import JSON Backup (REPLACE strategy - CAREFUL!)
**⚠️ WARNING:** This will delete all existing data!

**Action:**
1. Export current data first (safety backup)
2. Delete a card manually
3. Import the backup with **"Replace"** strategy
4. Click **"Import Data"**

**Expected Result:**
- Warning message appears about destructive operation
- After import, deleted card is restored
- All data matches the backup file exactly
- Page reloads automatically

---

## 📸 Image Features Test

### Test 9: Image Generation
**Action:**
1. Click **"Generate Image"** button
2. Enter prompt: "A colorful diagram of the water cycle with labels"
3. Click "Generate Image"

**Expected Result:**
- Takes 5-10 seconds
- Image appears on screen
- Uses Google Imagen 4.0
- Image is generated based on your description

**Backend Verification:**
- Check logs for `POST /api/gemini/generate-image`
- Rate limit: Only 10 per 15 minutes (strict limit)

### Test 10: Image Analysis
**Action:**
1. Click **"Analyze Image"** button
2. Upload an image (diagram, chart, photo)
3. Ask a question: "What do you see in this image?"
4. Click "Analyze Image"

**Expected Result:**
- AI describes the image contents
- Identifies objects, text, concepts
- Provides detailed analysis

---

## 🎵 Audio Features Test

### Test 11: Audio Transcription
**Action:**
1. Click **"Transcribe Audio"** button
2. Click **"Start Recording"**
3. Speak clearly: "This is a test of the audio transcription feature"
4. Click **"Stop Recording"**

**Expected Result:**
- Microphone permission granted
- Recording indicator shows
- After stopping, transcription appears
- Text should match what you said (approximately)

---

## 📝 Text Analysis Test

### Test 12: Text Analysis
**Action:**
1. Click **"Analyze Text"** button
2. Paste text (e.g., news article, scientific abstract)
3. Ask: "Summarize this in 3 bullet points"
4. Select **"Simple"** model
5. Click "Analyze"

**Expected Result:**
- AI processes the text
- Provides 3-bullet point summary
- Fast response (Gemini 2.5 Flash)

### Test 13: Complex Text Analysis
**Action:**
1. Same as Test 12, but select **"Complex"** model

**Expected Result:**
- More detailed analysis
- Better reasoning (Gemini 2.5 Pro)
- Slightly slower response

---

## 🔐 Backend Security Verification

### Test 14: Verify API Key is Secured
**Action:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Trigger any AI operation (e.g., create a deck)
4. Look at the requests

**Expected Result:**
- All requests go to `/api/gemini/*` (localhost)
- **NO requests** to `generativelanguage.googleapis.com` (direct Google API)
- **NO API key visible** in any request headers
- This proves the API key is secured on backend

### Test 15: Rate Limiting Test
**Action:**
1. Generate 5 images rapidly (click Generate Image 5 times)

**Expected Result:**
- First 10 requests succeed (strict limit for images)
- 11th request shows error: "Too many requests"
- Must wait 15 minutes for rate limit to reset
- Check backend logs for rate limit messages

---

## 📊 Study Progress Test

### Test 16: Set Study Goal
**Action:**
1. Say: **"Set my daily goal to 20 cards"**

**Expected Result:**
- AI confirms goal is set
- Progress bar appears showing 0/20 cards
- Counter updates as you review cards

---

## 🎯 Advanced Features Test

### Test 17: Card Editing
**Action:**
1. Say: **"Edit the card about Paris in World Capitals"**
2. Wait for AI to find the card
3. Say: **"Update the question to 'What is the capital city of France?'"**

**Expected Result:**
- AI finds the card about Paris
- Card content updates
- Changes saved to localStorage

### Test 18: Card Statistics
**Action:**
1. Say: **"Show stats for the Paris card in World Capitals"**

**Expected Result:**
- Displays FSRS statistics:
  - Stability (memory strength)
  - Difficulty (0-10 scale)
  - Review count
  - Lapse count
  - Next review date
- AI explains what the stats mean

### Test 19: Strengthen Weak Points
**Action:**
1. Review some cards and intentionally rate them as "Again" or "Hard"
2. Click **"Strengthen Weak Points"** on a deck

**Expected Result:**
- AI analyzes your review history
- Generates targeted practice cards for concepts you struggle with
- New cards added to the deck

---

## 🔍 Verification Checklist

After testing, verify:

### Frontend Functionality
- [x] Page loads on http://localhost:3000
- [x] 2 default decks visible
- [x] All buttons render correctly
- [x] Dark theme applied
- [ ] Voice recognition works
- [ ] TTS audio plays
- [ ] Navigation works (back buttons, state transitions)

### Backend Functionality
- [x] Server running on port 3001
- [x] API key configured: ✅
- [x] Health endpoint responds: `/health`
- [x] Gemini health endpoint responds: `/api/gemini/health`
- [ ] API requests logged in console
- [ ] Rate limiting enforced
- [ ] CORS allows localhost:3000

### AI Features
- [ ] Voice review works
- [ ] Deck generation (topic-based) works
- [ ] Deck generation (document-based) works
- [ ] Image generation works
- [ ] Image analysis works
- [ ] Audio transcription works
- [ ] Text analysis works
- [ ] Card explanation works

### Backup & Export Features (NEW)
- [ ] JSON export works
- [ ] CSV export works
- [ ] Anki export works
- [ ] JSON import with MERGE works
- [ ] JSON import with REPLACE works
- [ ] Validation detects errors
- [ ] Checksum verification works
- [ ] Import statistics display correctly

---

## 🐛 Troubleshooting

### Issue: "API Key not configured"
**Solution:** Check `server/.env` has real API key (not PLACEHOLDER_API_KEY)

### Issue: "CORS Error"
**Solution:** Backend must be running on port 3001, frontend on port 3000

### Issue: "Microphone not working"
**Solution:**
1. Check browser permissions (URL bar, camera/mic icon)
2. Try Chrome/Edge (best support for Web Audio API)
3. macOS: System Settings → Privacy & Security → Microphone

### Issue: "Rate limit exceeded"
**Solution:** Wait 15 minutes, or adjust limits in `server/middleware/rateLimit.js`

### Issue: "Voice not responding"
**Solution:**
1. Click on the page first to start session
2. Speak clearly and wait for AI to finish speaking
3. Check browser console for errors

---

## 📝 API Models Being Used

Your API key is currently using these Google Gemini models:

| Operation | Model | Cost (approx) |
|-----------|-------|---------------|
| Voice conversations | `gemini-2.5-flash-native-audio-preview-09-2025` | ~$0.01 per minute |
| TTS (card reading) | `gemini-2.5-flash-preview-tts` | ~$0.001 per card |
| Deck generation | `gemini-2.5-pro` | ~$0.10 per deck |
| Image generation | `imagen-4.0-generate-001` | ~$0.04 per image |
| Image analysis | `gemini-2.5-flash` | ~$0.001 per image |
| Text analysis (simple) | `gemini-2.5-flash` | ~$0.001 per request |
| Text analysis (complex) | `gemini-2.5-pro` | ~$0.01 per request |

**Estimated total cost for testing:** $1-2 USD for comprehensive testing session

---

## 🎉 Success Criteria

Your API key is **WORKING** if:
- ✅ Backend shows "API Key configured: ✅"
- ✅ Voice commands trigger AI responses
- ✅ Deck generation creates cards
- ✅ Image generation produces images
- ✅ No "Invalid API key" errors in backend logs
- ✅ All operations show 200 status codes in backend

---

## 🚀 Next Steps After Demo

1. **Create your own decks** using topics relevant to you
2. **Export your data** regularly (backup safety)
3. **Share decks** with others using CSV export
4. **Migrate to Anki** if needed using Anki export
5. **Monitor costs** at https://aistudio.google.com (quota tracking)

---

## ⚠️ Important Notes

### Anki .apkg Import
**Question:** Does it read Anki .apkg files?
**Answer:** **NO** - Currently only supports:
- CSV/TXT import (for creating new decks)
- JSON import (for restoring EchoCards backups)

To import from Anki:
1. Export from Anki as **Notes in Plain Text** (TXT/CSV format)
2. Use EchoCards "Import Deck" feature
3. Format: `Question, Answer, Explanation` (comma-separated)

### API Key Security
- Your API key is stored in `.env` files (gitignored)
- Never exposed in browser DevTools
- Protected by backend proxy
- Rate limiting prevents abuse

---

**Happy Testing! 🎓✨**
