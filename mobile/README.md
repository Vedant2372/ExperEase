# ExpertEase Mobile

React Native (Expo) app connected to the Python Flask backend.

## Setup

```bash
cd mobile
npm install
```

## Run

1. **Start the backend** (from project root):
   ```
   python app.py
   ```
   Backend runs on http://localhost:5000

2. **Start the mobile app**:
   ```
   npx expo start
   ```
   Then press `a` for Android emulator or `i` for iOS simulator.

## API Connection

- **Android emulator:** Uses `http://10.0.2.2:5000` (host machine)
- **iOS simulator:** Uses `http://localhost:5000`
- **Physical device:** Edit `src/config.js` and set your machine's local IP (e.g. `http://192.168.1.5:5000`). Ensure phone and computer are on the same network.

## Tech

- Expo SDK 51
- React Navigation (tabs + stack)
- AsyncStorage for auth token
- All JSX (no TypeScript)
