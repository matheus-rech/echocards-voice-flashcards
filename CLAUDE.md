# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EchoCards is a voice-powered flashcard study application built with React, TypeScript, and Vite. It uses Google's Gemini AI for multimodal interactions including voice conversations, text-to-speech, image generation/analysis, and audio transcription. The app implements the FSRS (Free Spaced Repetition Scheduler) algorithm for optimal learning intervals.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

**Required:** Set `GEMINI_API_KEY` in `.env.local` before running the app. The Vite config exposes this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` to the application.

## Architecture & Key Patterns

### State Management Architecture

The app uses a **finite state machine** pattern via `SessionState` enum (types.ts:28-47) to manage the user's journey:

- **IDLE** → **AWAITING_COMMAND** → **READING_QUESTION** → **AWAITING_ANSWER_REVEAL** → **READING_ANSWER** → **AWAITING_RATING** → cycle continues
- Special states: CONVERSATION, EDITING_CARD, SHOWING_DECKS, IMPORTING_DECK, SMART_GENERATION, etc.

The main state machine logic is in App.tsx:789-826. State transitions are controlled by both user actions (via Gemini function calls) and internal app logic.

### Audio Pipeline Architecture

**Critical Design Pattern (App.tsx:24-32):**

The app uses a **unified audio queue** (`audioQueue` ref) for all audio playback:
- Real-time conversational audio from Gemini Live API
- Pre-generated TTS audio for reading flashcards
- Sequential playback via `processAudioQueue()` function (App.tsx:116-153)
- Single output sample rate: 24kHz (OUTPUT_AUDIO_SAMPLE_RATE)
- Input audio: 16kHz (INPUT_AUDIO_SAMPLE_RATE)

**Audio flow:**
1. Audio data arrives (from Live API or TTS)
2. Base64 → decoded → AudioBuffer via `geminiService.decodeAudioData()`
3. Push to `audioQueue`
4. `processAudioQueue()` consumes queue sequentially
5. `currentAudioSourceRef` tracks active playback

### Gemini Service Integration

**Three distinct Gemini usage patterns:**

1. **Live API Session** (geminiService.ts:313-365):
   - Bidirectional voice conversation
   - Model: `gemini-2.5-flash-native-audio-preview-09-2025`
   - Function calling for app control (28 control functions defined)
   - Real-time audio I/O with microphone stream processing
   - Voice selection via `VoiceName` type (Zephyr, Puck, Charon, Kore, Fenrir)

2. **Dedicated TTS** (geminiService.ts:375-391):
   - Model: `gemini-2.5-flash-preview-tts`
   - Used for reading flashcards and status updates
   - Returns complete audio file (not streaming)
   - Base64 encoded PCM audio

3. **Content Generation** (geminiService.ts:444-655):
   - Model: `gemini-2.5-pro` with thinking budget (32768)
   - JSON schema-based responses for structured data
   - Used for: deck generation, card explanations, targeted card creation
   - Model: `gemini-2.5-flash` for image/audio analysis
   - Model: `imagen-4.0-generate-001` for image generation

### Function Calling System

The app is controlled via **28 function declarations** (geminiService.ts:58-278) that the AI assistant ("Echo") calls based on user voice commands:

- **Review flow:** startReview, showAnswer, rateCard
- **Deck management:** createDeck, deleteDeck, listDecks, showDecks
- **Card operations:** createCard, findCardToEdit, updateCardContent
- **AI features:** generateDeckFromForm, generateDeckFromDocument, generateCardsFromWeakness
- **Multimodal:** generateImage, showImageAnalysisView, showTranscriptionView
- **Navigation:** goBack, showImportView, showSmartGenerationView

Each function call is processed in `processToolCall()` (App.tsx:718-752) which dispatches to appropriate handlers.

### FSRS Spaced Repetition Algorithm

**Implementation:** services/fsrs.ts

The app uses FSRS-4.5 algorithm with default weights (W array, fsrs.ts:5-13). Key concepts:

- **Stability:** Time until retrievability drops to 90%
- **Difficulty:** Card difficulty (1-10 scale)
- **Card States:** NEW → LEARNING → REVIEW (or RELEARNING after lapses)
- **Ratings:** AGAIN (1), HARD (2), GOOD (3), EASY (4)

**Scheduling logic:**
- `calculateNextReview()` is the entry point (fsrs.ts:25-51)
- New cards: `scheduleAsNew()` - use initial stability weights
- Learning/Relearning: `scheduleAsLearning()` - short intervals
- Review: `scheduleAsReview()` - calculates new stability using retrievability

**Important note:** The implementation assumes on-time reviews (retrievability = 0.9) as a simplification (fsrs.ts:37-38).

### Data Persistence

**Storage Service** (services/storageService.ts):
- Uses localStorage with three main keys:
  - `echoCards_decks`: Deck metadata
  - `echoCards_cards`: Card data with FSRS properties
  - `echoCards_studyProgress`: Daily/session goals
- **Seed data:** Two default decks (World Capitals, Cognitive Biases) initialized on first load
- Date serialization: Cards store `dueDate` as ISO strings, parsed back to Date objects
- Study progress resets daily if goal type is 'daily'

### Knowledge Base System

**Simple RAG simulation** (services/knowledgeBaseService.ts):
- Client-side knowledge base with 5 cognitive bias explanations
- Keyword-based search (real RAG would use vector embeddings)
- Used by `generateCardsFromWeakness` to create targeted practice cards
- `findRelevantChunk()` scores chunks by matching query words (>3 chars)

## Component Organization

### Main Components (components/ directory):

- **CardView**: Displays flashcard with flip animation
- **DeckListView**: Grid of decks with action buttons
- **ImportDeckView**: CSV/TXT file upload for deck import
- **SmartGenerationView**: AI deck creation (form-based or document-based)
- **CardStatsView**: Shows FSRS statistics + AI explanation generation
- **ImageGenerationView**: Imagen-based image generation
- **ImageAnalysisView**: Upload and analyze images with Gemini
- **TranscriptionView**: Record and transcribe audio
- **TextAnalysisView**: Analyze text with simple/complex models
- **AudioControls**: Play/Pause/Stop controls
- **StatusIndicator**: Current status text with speaking indicator
- **TranscriptView**: Scrollable conversation history
- **ToggleSwitch**: Conversational mode toggle

## Code Modification Guidelines

### When adding new AI features:

1. **Add function declaration** to `controlFunctions` array in geminiService.ts
2. **Create handler** in App.tsx (e.g., `handleNewFeature`)
3. **Add case** to `processToolCall()` switch statement
4. **Update system instruction** if needed (systemInstructionBase in geminiService.ts:280-305)
5. Consider whether new SessionState is needed

### When modifying audio behavior:

- Always push to `audioQueue`, never create separate audio sources
- Use `playTts()` for speaking text
- Respect the unified queue pattern to avoid race conditions
- Sample rate: 24kHz for output, 16kHz for input

### When changing FSRS logic:

- Modify only services/fsrs.ts
- Test with different card states (NEW, LEARNING, REVIEW, RELEARNING)
- Ensure dueDate calculations use `addDays()` helper for consistency
- Update Card type in types.ts if adding FSRS properties

### When adding storage features:

- Add new localStorage key constant to storageService.ts
- Handle JSON serialization/deserialization (especially Date objects)
- Use `storageService` methods, not direct localStorage access
- Consider data migration if changing storage schema

## Testing Considerations

The app has no automated tests. When manually testing:

1. **Audio flow:** Test with different voices, ensure queue doesn't skip/overlap
2. **State machine:** Test all state transitions, especially edge cases (interruptions during review)
3. **FSRS accuracy:** Verify cards graduate from NEW → LEARNING → REVIEW correctly
4. **Conversational mode:** Test with toggle on/off, ensure `startConversation` only called when enabled
5. **Multimodal features:** Test image generation, analysis, transcription with various inputs
6. **CSV import:** Test with comma and semicolon delimiters, handle malformed lines

## Common Gotchas

- **AudioContext suspension:** Always check and resume AudioContext before playback (App.tsx:127-129)
- **Date serialization:** Cards store dates as ISO strings in localStorage, parse back to Date objects
- **Function call responses:** Always send tool response after processing (App.tsx:749-751)
- **Conversational mode:** Only includes `startConversation` instruction when enabled
- **API key:** Exposed as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY` (vite.config.ts)
