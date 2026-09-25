# Benny

Benny is a receipt-scanning personal finance and budgeting app for iOS. Users scan grocery receipts, get automatic line-item extraction and category tracking, and set spending goals aligned to their paycheck cadence.

Benny is a portfolio piece built alongside [MarketQuad](https://github.com/), forming a thematically coherent pair of financial safety and awareness tools.

## Features (Phase 1)

- Receipt scanning with line-item extraction
- Category-based spending tracking
- Paycheck-cadence spending goals
- Push notifications for budget check-ins

**Explicitly out of scope for Phase 1:** bank integration, grocery price prediction, and recipe costing. These are planned for Phase 2, where price prediction starts with external APIs and is gradually replaced by personalized historical data from the user's own scanned receipts.

## Tech Stack

**Mobile (client)**
- Expo + React Native, with Expo Router for navigation
- NativeWind (Tailwind v4, `@theme` directive) for styling
- Zustand for state management (`usePreferences` is the single source of truth for user configuration)
- `expo-camera` for receipt capture (`CameraView` requires a dev build, not Expo Go)
- `expo-notifications` for budget reminders

**Backend (server)**
- Spring Boot (Java) — package root `com.benny.benny`
- `GeminiService` / `GeminiConfig` wrap Google's `genai` Client for AI-based receipt parsing
- Gemini Flash 2.5 for receipt parsing, with structured JSON output enforced via `responseMimeType` and a defined schema

**Storage & Auth**
- Firebase for authentication and storage

## Design System

Benny follows an aesthetic:
- Fonts: Fredoka One (display), Nunito (UI)
- Blush-pink palette, primary red `#e61e3f`
- Pill-shaped buttons, rounded cards, soft shadows
- Light mode only — no dark mode

## Project Structure

```
benny/
├── client/          # Expo / React Native app
│   ├── app/         # Expo Router screens
│   ├── components/  # Shared UI components
│   └── store/       # Zustand stores
└── server/         # Spring Boot service
    └── src/main/java/com/benny/benny/
    |-- controller/ # REST controllers
    |-- domain/ # entities 
    |-- filters/ # middleware
    |-- mapper/ # domain mappers
    |-- repository/ # firebase repository
    |-- service/ # firebase service, gemini service, and benny service
    |-- config/ # config for gemini api and firebase
    |-- secrets/
    |-- target/
       
```

## Getting Started

### Client

```bash
cd client
bun install
bunx expo start # CameraView requires a dev build
```

### Backend

```bash
cd server
./mvnw spring-boot:run
```

### Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key for Google Gemini |
| `FIREBASE_PROJECT_ID` | Firebase project identifier |
| `FIREBASE_SERVICE_ACCOUNT` | Path or JSON for Firebase service account credentials |

## Development Principles

- **Screens-first development** — UI is built before wiring logic
- **MVP scope discipline** — features are explicitly excluded from v1 to maintain focus
- Benny's "aha moment" is a user's first successfully scanned receipt; onboarding is designed to reach that moment quickly
- Zustand is the canonical state layer — no prop-drilling for user preferences

## Roadmap

- [ ] Dashboard, Receipts, and Analytics tabs
- [ ] Full receipt scan flow: Capture → Processing → Review & Confirm, with OCR failure handling
- [ ] Phase 2: grocery price prediction

## Author

Built by Me (Samuel Nnawuihe-Echefu), a Computer Science and Software Systems student at the University of Victoria, as a Co-op portfolio piece.
