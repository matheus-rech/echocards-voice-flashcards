# EchoCards - Complete UI Walkthrough

## 🎨 Visual Guide to All Frontend Functionalities

The browser should now be open at **http://localhost:3000**

---

## 📱 Main Screen Layout

### **Top Section - Always Visible**

1. **Status Bar**
   - 📍 Location: Top of screen
   - Shows current status text (e.g., "Say 'Start Review' to begin")
   - Voice activity indicator (when AI is speaking)

2. **Audio Controls** (when active)
   - ▶️ Play button
   - ⏸️ Pause button
   - ⏹️ Stop button
   - Appears during audio playback

3. **Conversational Mode Toggle**
   - 📍 Location: Top right
   - Switch between Command Mode and Conversational Mode
   - ON = Natural conversation, OFF = Specific commands only

4. **Voice Selector Dropdown**
   - 📍 Location: Top section
   - Choose from 5 voices:
     - Zephyr (default)
     - Puck
     - Charon
     - Kore
     - Fenrir

---

## 🏠 Home Screen - Deck List View

### **What You See:**

#### **Search Bar**
```
┌────────────────────────────────────┐
│ 🔍 Search decks...                │
└────────────────────────────────────┘
```
- Filter decks by name
- Real-time search as you type

#### **Action Buttons Row** (Top Action Bar)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Generate    │ Analyze     │ Analyze     │ Transcribe  │
│ Image       │ Image       │ Text        │ Audio       │
│ 🎨          │ 🖼️          │ 📝          │ 🎤          │
└─────────────┴─────────────┴─────────────┴─────────────┘

┌─────────────┬─────────────┬─────────────┐
│ Import      │ Smart       │ Backup &    │
│ Deck        │ Create Deck │ Restore     │
│ 📥          │ 🤖          │ 💾          │
└─────────────┴─────────────┴─────────────┘
```

**Button Colors:**
- **Purple** (Generate Image) - `bg-purple-600`
- **Teal** (Analyze Image) - `bg-teal-600`
- **Yellow** (Analyze Text) - `bg-yellow-600`
- **Indigo** (Transcribe Audio) - `bg-indigo-600`
- **Green** (Import Deck) - `bg-green-600`
- **Orange** (Smart Create Deck) - `bg-orange-600`
- **Pink** (Backup & Restore) - `bg-pink-600` ✨ **NEW!**

#### **Default Decks** (Card Grid)
```
┌───────────────────┐  ┌───────────────────┐
│  World Capitals   │  │ Cognitive Biases  │
│                   │  │                   │
│  ┌─────────────┐ │  │  ┌─────────────┐ │
│  │Start Review │ │  │  │Start Review │ │
│  └─────────────┘ │  │  └─────────────┘ │
│  ┌─────────────┐ │  │  ┌─────────────┐ │
│  │Strengthen   │ │  │  │Strengthen   │ │
│  │Weak Points  │ │  │  │Weak Points  │ │
│  └─────────────┘ │  │  └─────────────┘ │
└───────────────────┘  └───────────────────┘
```

**Each Deck Card Shows:**
- Deck name (centered, bold)
- "Start Review" button (blue)
- "Strengthen Weak Points" button (cyan)
- Hover effect: Card scales up slightly

---

## 🎯 Functionality Screens (Click Each Button)

### 1️⃣ **Generate Image** (Purple Button)

**Screen Layout:**
```
┌─────────────────────────────────────────┐
│         Generate Image with AI          │
├─────────────────────────────────────────┤
│                                         │
│ Enter your image description:          │
│ ┌─────────────────────────────────────┐│
│ │ A colorful diagram of the water    ││
│ │ cycle with labels                  ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────┐  ┌─────────────┐     │
│ │   Cancel    │  │  Generate   │     │
│ └─────────────┘  │   Image     │     │
│                  └─────────────┘     │
│                                         │
│ [Generated image appears here]         │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Text input for image prompt
- Generate button triggers Imagen 4.0
- Cancel button returns to deck list
- Loading state: "Generating..."
- Result: Image displays below input

**What It Does:**
- Uses Google Imagen 4.0
- Creates images from text descriptions
- Rate limited: 10 per 15 minutes
- Cost: ~$0.04 per image

---

### 2️⃣ **Analyze Image** (Teal Button)

**Screen Layout:**
```
┌─────────────────────────────────────────┐
│          Analyze Image with AI          │
├─────────────────────────────────────────┤
│                                         │
│ Upload an image:                        │
│ ┌─────────────────────────────────────┐│
│ │     📁 Choose File                  ││
│ │     [No file selected]              ││
│ └─────────────────────────────────────┘│
│                                         │
│ Ask a question about the image:        │
│ ┌─────────────────────────────────────┐│
│ │ What do you see in this image?     ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────┐  ┌─────────────┐     │
│ │   Cancel    │  │  Analyze    │     │
│ └─────────────┘  │   Image     │     │
│                  └─────────────┘     │
│                                         │
│ [Analysis result appears here]         │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- File upload button (accepts images)
- Question text input
- Preview of uploaded image
- Analyze button
- Results display below

**What It Does:**
- Accepts JPG, PNG, GIF, etc.
- AI analyzes image content
- Answers questions about the image
- Uses Gemini 2.5 Flash

---

### 3️⃣ **Analyze Text** (Yellow Button)

**Screen Layout:**
```
┌─────────────────────────────────────────┐
│           Analyze Text with AI          │
├─────────────────────────────────────────┤
│                                         │
│ Enter or paste text to analyze:        │
│ ┌─────────────────────────────────────┐│
│ │                                     ││
│ │  [Large text area]                 ││
│ │                                     ││
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│ What would you like to know?           │
│ ┌─────────────────────────────────────┐│
│ │ Summarize this in 3 bullet points ││
│ └─────────────────────────────────────┘│
│                                         │
│ Model complexity:                       │
│ ○ Simple (Fast)   ● Complex (Detailed) │
│                                         │
│ ┌─────────────┐  ┌─────────────┐     │
│ │   Cancel    │  │   Analyze   │     │
│ └─────────────┘  └─────────────┘     │
│                                         │
│ [Analysis result appears here]         │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Large text area for input
- Question/prompt input
- Model selector:
  - ○ Simple = Gemini 2.5 Flash (fast)
  - ○ Complex = Gemini 2.5 Pro (detailed)
- Result display area

**What It Does:**
- Analyzes any text content
- Answers questions about the text
- Summarizes, explains, extracts info
- Choose speed vs. quality

---

### 4️⃣ **Transcribe Audio** (Indigo Button)

**Screen Layout:**
```
┌─────────────────────────────────────────┐
│      Transcribe Audio with Whisper      │
├─────────────────────────────────────────┤
│                                         │
│ Record audio to transcribe:             │
│                                         │
│      ┌─────────────────────┐           │
│      │    🎤 Recording...   │           │
│      │    [Audio Waveform]  │           │
│      └─────────────────────┘           │
│                                         │
│ ┌─────────────┐  ┌─────────────┐     │
│ │    Back     │  │ Start/Stop  │     │
│ │             │  │  Recording  │     │
│ └─────────────┘  └─────────────┘     │
│                                         │
│ Transcription:                          │
│ ┌─────────────────────────────────────┐│
│ │ This is the transcribed text from  ││
│ │ your audio recording...            ││
│ └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Start Recording button (activates microphone)
- Recording indicator
- Stop Recording button
- Transcription result display
- Back button

**What It Does:**
- Records audio from microphone
- Transcribes speech to text
- Uses Gemini 2.5 Flash with audio
- Useful for creating cards from lectures

---

### 5️⃣ **Import Deck** (Green Button)

**Screen Layout:**
```
┌─────────────────────────────────────────┐
│            Import New Deck              │
├─────────────────────────────────────────┤
│ Select a .csv or .txt file. Each line  │
│ should contain a question, an answer,   │
│ and an optional explanation, separated  │
│ by a comma or semicolon.                │
│                                         │
│ New Deck Name:                          │
│ ┌─────────────────────────────────────┐│
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌───────────────────────────────────┐ │
│ │  📁 Choose a file to upload...    │ │
│ └───────────────────────────────────┘ │
│                                         │
│ ┌─────────────┐  ┌─────────────┐     │
│ │   Cancel    │  │  Import     │     │
│ │             │  │   Deck      │     │
│ └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────┘
```

**Features:**
- Deck name input
- File upload (CSV or TXT)
- Format instructions shown
- Import button (disabled until file selected)

**What It Does:**
- Creates new deck from CSV/TXT file
- Format: `Question, Answer, Explanation`
- Supports comma or semicolon delimiters
- Validates file format

**NOTE:** Does NOT support Anki .apkg files!

---

### 6️⃣ **Smart Create Deck** (Orange Button)

**Screen Layout with TWO TABS:**

#### **Tab 1: Generate from Topic**
```
┌─────────────────────────────────────────┐
│      Smart Deck Generation              │
├─────────────────────────────────────────┤
│  [ Topic ]  [ Document ]                │
├─────────────────────────────────────────┤
│                                         │
│ Deck Name:                              │
│ ┌─────────────────────────────────────┐│
│ │ Python Programming                  ││
│ └─────────────────────────────────────┘│
│                                         │
│ Topic/Subject:                          │
│ ┌─────────────────────────────────────┐│
│ │ Object-oriented programming         ││
│ └─────────────────────────────────────┘│
│                                         │
│ Knowledge Depth:                        │
│ ┌─────────────────────────────────────┐│
│ │ ▼ Intermediate                      ││
│ └─────────────────────────────────────┘│
│ Options: Basic, Intermediate, Advanced  │
│                                         │
│ Number of Cards:                        │
│ ┌─────────────────────────────────────┐│
│ │ 10                                  ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────┐  ┌─────────────┐     │
│ │   Cancel    │  │  Generate   │     │
│ │             │  │    Deck     │     │
│ └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────┘
```

#### **Tab 2: Generate from Document**
```
┌─────────────────────────────────────────┐
│      Smart Deck Generation              │
├─────────────────────────────────────────┤
│  [ Topic ]  [ Document ]                │
├─────────────────────────────────────────┤
│                                         │
│ Deck Name:                              │
│ ┌─────────────────────────────────────┐│
│ │ Cell Biology                        ││
│ └─────────────────────────────────────┘│
│                                         │
│ Paste your document text:              │
│ ┌─────────────────────────────────────┐│
│ │                                     ││
│ │  [Large text area for document]    ││
│ │                                     ││
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│ Number of Cards:                        │
│ ┌─────────────────────────────────────┐│
│ │ 15                                  ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────┐  ┌─────────────┐     │
│ │   Cancel    │  │  Generate   │     │
│ │             │  │    Deck     │     │
│ └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────┘
```

**Features:**
- Two-tab interface
- **Topic tab:** Generate from subject + depth + count
- **Document tab:** Paste text and specify card count
- Dropdown for knowledge depth
- Number input for card count
- Generate button

**What It Does:**
- Uses Gemini 2.5 Pro for generation
- Creates complete flashcard deck in seconds
- Extracts key concepts from documents
- Generates questions, answers, and explanations

---

### 7️⃣ **Backup & Restore** (Pink Button) ✨ **NEW!**

**Screen Layout with TWO TABS:**

#### **Tab 1: Export Data**
```
┌─────────────────────────────────────────┐
│         Backup & Restore                │
├─────────────────────────────────────────┤
│  [ Export Data ]  [ Import Data ]       │
├─────────────────────────────────────────┤
│                                         │
│ Export Format:                          │
│                                         │
│ ● JSON - Complete backup with all data │
│   (Recommended)                         │
│                                         │
│ ○ CSV - Cards only, for spreadsheet    │
│   editing                               │
│                                         │
│ ○ Anki - Import into Anki flashcard    │
│   app                                   │
│                                         │
│ Options (JSON only):                    │
│ ☑ Include preferences                  │
│ ☑ Include checksum                     │
│                                         │
│      ┌─────────────────────┐           │
│      │  Export as JSON     │           │
│      └─────────────────────┘           │
│                                         │
│ 💡 Tip: Export your data regularly     │
│    to prevent data loss. JSON format   │
│    is recommended for complete backups. │
│                                         │
└─────────────────────────────────────────┘
```

#### **Tab 2: Import Data**
```
┌─────────────────────────────────────────┐
│         Backup & Restore                │
├─────────────────────────────────────────┤
│  [ Export Data ]  [ Import Data ]       │
├─────────────────────────────────────────┤
│                                         │
│ Select File:                            │
│ ┌───────────────────────────────────┐  │
│ │  📁 Choose file...                │  │
│ └───────────────────────────────────┘  │
│                                         │
│ Selected: echocards-backup-2025.json    │
│ (25.4 KB)                               │
│                                         │
│ Validation Results:                     │
│ ┌─────────────────────────────────────┐│
│ │ ✓ File is valid and ready to       ││
│ │   import                            ││
│ └─────────────────────────────────────┘│
│                                         │
│ Import Strategy:                        │
│                                         │
│ ● Merge - Combine with existing data   │
│   (imported overwrites conflicts)       │
│                                         │
│ ○ Replace - Delete all existing data   │
│   and import (⚠️ Destructive)           │
│                                         │
│ ○ Skip - Only add new items, keep      │
│   existing unchanged                    │
│                                         │
│ ┌─────────────┐  ┌─────────────┐      │
│ │    Clear    │  │  Import     │      │
│ │             │  │   Data      │      │
│ └─────────────┘  └─────────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

**After Import Success:**
```
┌─────────────────────────────────────────┐
│ Import Results:                         │
│ ┌─────────────────────────────────────┐│
│ │ ✓ Successfully imported 5 decks and ││
│ │   120 cards                         ││
│ └─────────────────────────────────────┘│
│                                         │
│ Statistics:                             │
│ ┌─────────────────────────────────────┐│
│ │ Decks Imported:     5               ││
│ │ Cards Imported:     120             ││
│ │ Decks Skipped:      0               ││
│ │ Cards Skipped:      0               ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────┐                │
│ │ Import Another File │                │
│ └─────────────────────┘                │
└─────────────────────────────────────────┘
```

**Features:**
- Two-tab interface (Export/Import)
- **Export:** 3 formats (JSON/CSV/Anki)
- **Import:** File selection with validation
- Real-time validation feedback
- Three import strategies
- Detailed import statistics
- Success/error message boxes
- Checksum verification (JSON only)

**What It Does:**
- **JSON Export:** Complete backup with checksum
- **CSV Export:** Spreadsheet-friendly format
- **Anki Export:** TSV format for Anki import
- **Import:** Validates, merges, and restores data
- **Protection:** Checksum ensures data integrity

---

## 🎴 Card Review Screen

**When you click "Start Review" on any deck:**

```
┌─────────────────────────────────────────┐
│  Reviewing: World Capitals              │
│  Card 1 of 25                           │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│         What is the capital            │
│              of France?                 │
│                                         │
│                                         │
│                                         │
│  [Card flips to show answer when       │
│   you say "Show answer"]                │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**After Saying "Show Answer":**
```
┌─────────────────────────────────────────┐
│  Reviewing: World Capitals              │
│  Card 1 of 25                           │
├─────────────────────────────────────────┤
│         What is the capital            │
│              of France?                 │
│                                         │
│         ─────────────────              │
│                                         │
│              Paris                      │
│                                         │
│  Explanation: Paris has been the       │
│  capital of France since...            │
│                                         │
└─────────────────────────────────────────┘
```

**Voice Commands:**
- "Show answer" - Reveals answer
- "Again" - Mark as forgotten (review soon)
- "Hard" - Mark as difficult (review sooner)
- "Good" - Mark as remembered (normal schedule)
- "Easy" - Mark as very easy (review later)

---

## 🎯 Card Statistics View

**When you say "Show stats for [card]":**

```
┌─────────────────────────────────────────┐
│         Card Statistics                 │
├─────────────────────────────────────────┤
│ Question:                               │
│ "What is the capital of France?"        │
│                                         │
│ FSRS Statistics:                        │
│ ┌─────────────────────────────────────┐│
│ │ Stability:      45.2 days           ││
│ │ Difficulty:     5.2 / 10            ││
│ │ Total Reviews:  12                  ││
│ │ Lapses:         2                   ││
│ │ State:          REVIEW              ││
│ │ Next Review:    2025-11-15          ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────┐                │
│ │  Explain These Stats│                │
│ └─────────────────────┘                │
│                                         │
│ [AI explanation appears when clicked]  │
│                                         │
│ ┌─────────────────────┐                │
│ │       Back          │                │
│ └─────────────────────┘                │
└─────────────────────────────────────────┘
```

**What the Stats Mean:**
- **Stability:** How long memory lasts (in days)
- **Difficulty:** Card difficulty rating (1-10)
- **Total Reviews:** Number of times reviewed
- **Lapses:** Times you forgot the card
- **State:** NEW, LEARNING, REVIEW, or RELEARNING
- **Next Review:** When card is due next

---

## 🎙️ Voice Interaction Indicators

### **When AI is Speaking:**
```
🔊 Echo is speaking...
```

### **When Listening:**
```
🎤 Listening...
```

### **When Processing:**
```
⏳ Processing...
```

---

## 📊 Study Progress Bar

**Visible during review sessions:**
```
Daily Goal: 15 cards
┌────────────────────────────────────────┐
│██████████████░░░░░░░░░░░░░░░░░░░░░░░░│ 10/15
└────────────────────────────────────────┘
```

---

## 🎨 Color Scheme (Dark Theme)

**Background Colors:**
- Main background: `#1e1e1e` (dark gray)
- Card background: `#2a2a2a` (lighter gray)
- Input fields: `#333333` (medium gray)

**Button Colors:**
- Blue: Review actions
- Purple: Image generation
- Teal: Image analysis
- Yellow: Text analysis
- Indigo: Audio transcription
- Green: Import
- Orange: Smart generation
- Pink: Backup & Restore ✨
- Cyan: Strengthen weakness
- Gray: Cancel/Secondary actions

**Text Colors:**
- Primary text: `#e0e0e0` (light gray)
- Secondary text: `#aaa` (gray)
- Success: `#a5d6a7` (green)
- Error: `#ef9a9a` (red)
- Warning: `#ffcc80` (orange)

---

## 🎯 Navigation Flow

```
Home (Deck List)
    ├─→ Generate Image
    ├─→ Analyze Image
    ├─→ Analyze Text
    ├─→ Transcribe Audio
    ├─→ Import Deck
    ├─→ Smart Create Deck
    ├─→ Backup & Restore ✨
    └─→ Start Review (Deck)
            ├─→ Card View
            ├─→ Show Answer
            ├─→ Rate Card
            └─→ Show Stats
```

**Back Button:** Always visible to return to deck list

---

## 🎤 Voice Commands Summary

### **Global Commands:**
- "Start review [deck name]"
- "Create a deck called [name]"
- "Show decks"
- "Show backup view" ✨
- "Generate an image of [description]"
- "Analyze this image"
- "Transcribe audio"
- "Analyze this text"

### **During Review:**
- "Show answer"
- "Again" / "Hard" / "Good" / "Easy"
- "Explain this card"
- "Show stats for this card"
- "Go back"

### **Deck Management:**
- "Add a card to [deck]"
- "Edit the card about [topic] in [deck]"
- "Delete the deck [name]"
- "Strengthen weak points in [deck]"

---

## 💡 UI Features Not Immediately Visible

### **Hidden Features:**
1. **Right-click context menus** - None implemented
2. **Keyboard shortcuts** - None implemented
3. **Drag and drop** - Not implemented
4. **Multi-select** - Not implemented

### **Automatic Features:**
1. **Spaced Repetition** - Happens behind the scenes
2. **LocalStorage Sync** - Automatic save
3. **Audio Queue** - Manages playback automatically
4. **Rate Limiting** - Backend enforces silently

---

## 🎉 What You Should Be Seeing NOW

1. ✅ **Dark theme interface**
2. ✅ **2 default decks** in grid layout
3. ✅ **7 colorful action buttons** at the top
4. ✅ **Search bar** for filtering decks
5. ✅ **Voice selector dropdown**
6. ✅ **Conversational mode toggle**
7. ✅ **Status text** showing instructions
8. ✅ **Clean, modern design** with rounded corners
9. ✅ **Responsive layout** (works on mobile too)

---

## 🚀 Try These Quick Tests

### **Test 1: Visual Inspection**
- Count the action buttons (should be 7)
- Find the **pink "Backup & Restore" button** ✨
- Locate the search bar
- See the 2 default decks

### **Test 2: Click Through UI**
1. Click "Backup & Restore" → See export/import tabs
2. Click "Export Data" → Select JSON → See options
3. Go back → Click "Smart Create Deck" → See 2 tabs
4. Go back → Click "Generate Image" → See prompt input

### **Test 3: Voice Interaction**
1. Click anywhere to start
2. Grant microphone permission
3. Say "Show decks"
4. Hear AI response

---

## 📸 Visual Reference Guide

### **Main Screen Composition:**
```
┌──────────────────────────────────────────────┐
│ Status: "Say 'Start Review' to begin"       │
│ [Voice Selector ▼] [Conversational Mode ○]  │
├──────────────────────────────────────────────┤
│ [ Search decks... 🔍                       ] │
├──────────────────────────────────────────────┤
│ [🎨 Gen] [🖼️ Analyze] [📝 Text] [🎤 Audio]   │
│ [📥 Import] [🤖 Smart] [💾 Backup] ✨       │
├──────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐        │
│  │World Capitals│  │Cognitive     │        │
│  │              │  │Biases        │        │
│  │[Start Review]│  │[Start Review]│        │
│  │[Strengthen  ]│  │[Strengthen  ]│        │
│  └──────────────┘  └──────────────┘        │
└──────────────────────────────────────────────┘
```

---

## ✨ Summary of ALL Functionalities Visible in UI

### **7 Main Action Buttons:**
1. 🎨 **Generate Image** - Create images from text
2. 🖼️ **Analyze Image** - AI analyzes uploaded images
3. 📝 **Analyze Text** - AI analyzes text content
4. 🎤 **Transcribe Audio** - Speech to text
5. 📥 **Import Deck** - Import from CSV/TXT
6. 🤖 **Smart Create Deck** - AI deck generation
7. 💾 **Backup & Restore** - Export/Import data ✨

### **Per-Deck Actions (2 buttons each):**
1. **Start Review** - Begin studying
2. **Strengthen Weak Points** - Generate targeted cards

### **Global Controls:**
- Voice selector (5 voices)
- Conversational mode toggle
- Search bar
- Status display
- Audio controls (when active)

### **Review Screen Controls:**
- Show answer (voice/button)
- Rate card: Again/Hard/Good/Easy
- Card counter (e.g., "1 of 25")
- Back button

### **Statistics View:**
- FSRS metrics display
- Explain stats button
- Back button

### **Backup & Restore:**
- Export: JSON/CSV/Anki formats
- Import: File upload with validation
- Three merge strategies
- Real-time validation
- Checksum verification
- Import statistics

---

**The browser is now open! Explore all these features visually. 🚀**

Everything described above should be visible and clickable in your browser at **http://localhost:3000**
