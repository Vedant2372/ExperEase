# React Native ExpertEase Setup

## Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

## Installation

### 1. Create React Native Project
```bash
npx react-native init ExpertEaseMobile --template react-native-template-typescript
cd ExpertEaseMobile
```

### 2. Install Dependencies
```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# UI Components
npm install react-native-vector-icons react-native-paper
npm install react-native-linear-gradient

# HTTP Client
npm install axios

# File Upload
npm install react-native-document-picker react-native-fs

# Voice (optional)
npm install react-native-voice

# Storage
npm install @react-native-async-storage/async-storage
```

### 3. Android Setup
```bash
cd android
./gradlew clean
cd ..
```

### 4. iOS Setup
```bash
cd ios
pod install
cd ..
```

## Project Structure
```
ExpertEaseMobile/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── NavBar.tsx
│   │   └── common/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── AiCareScreen.tsx
│   │   ├── DoctorsScreen.tsx
│   │   ├── AppointmentsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── worker/
│   │       ├── WorkerDashboard.tsx
│   │       ├── DocumentUpload.tsx
│   │       └── WorkerProfile.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── mockApi.ts
│   │   └── auth.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── doctor.ts
│   │   └── appointment.ts
│   └── utils/
│       ├── constants.ts
│       └── helpers.ts
├── App.tsx
└── package.json
```

## Run Commands
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios

# Start Metro Bundler
npx react-native start
```

## Key Features to Implement
1. ✅ Interactive Specialization Cards (like CLI.py)
2. ✅ Worker Document Upload System
3. ✅ Mock API for standalone testing
4. ✅ Purple theme matching screenshots
5. ✅ Bottom navigation with 5 tabs
6. ✅ AI Care chat interface
7. ✅ Appointment booking system
