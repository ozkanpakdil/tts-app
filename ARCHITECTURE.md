# Architecture Documentation - TTS-App

## Overview
TTS-App is a cross-platform mobile application designed to provide high-quality text-to-speech functionality. It prioritizes on-device, free solutions while offering premium cloud-based options for users who require higher fidelity or specific voices.

## Tech Stack

### Frontend
- **Framework**: React Native (0.76+)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand or Redux Toolkit
- **Storage**: AsyncStorage for local settings
- **TTS Library**: `react-native-tts` (wraps AVSpeechSynthesizer on iOS and TextToSpeech on Android)
- **Authentication**: Firebase Auth (Google and Apple Sign-In)

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security with Firebase Admin SDK for token verification
- **Cloud Integration**: AWS SDK (Polly), Google Cloud SDK, Azure Speech SDK

## System Components

### 1. Mobile Application (Frontend)
- **Text Provider**: Extracts text from manual input, PDF files, DOCX files, or TXT files. Supports local extraction for PDF/TXT and backend-assisted extraction for DOCX.
- **Document Library**: A dedicated library to manage all imported documents, with persistent local storage.
- **TTS Engine Manager**: Determines whether to use on-device TTS or cloud TTS based on user preference and connectivity.
- **Audio Export Manager**: Captures audio streams and saves them as MP3/WAV files. Uses `react-native-tts` synthesizeToFile and `react-native-fs`.
- **Audio Library**: Manages saved audio files with options to play, delete, and share.
- **Price Calculator**: Calculates estimated costs for cloud TTS based on character count.
- **Audio Player**: Integrated using `react-native-video` to play cloud TTS audio and saved recordings.
- **Theme Manager**: Supports Light, Dark, and System default themes via React Navigation.
- **Text Highlighting**: Visually tracks speech progress by highlighting the current word/phrase in the Reader Screen.
- **Bookmarks**: Allows users to save specific positions in documents to resume reading later.
- **Feedback**: Built-in mechanism to send feedback and bug reports to the support team.
- **Analytics & Crashlytics**: Integrated via Firebase for performance monitoring and usage insights.
- **Data Deletion**: Mandatory user account and data deletion functionality implemented for store compliance.
- **Offline Sync**: Queues preference updates and usage logs while offline, synchronizing them to the backend upon reconnection.

### 2. Spring Boot Backend (Optional Proxy)
- **User Service**: Manages user profiles and synchronization of preferences (language, voice, rate, pitch, theme) across devices.
- **Security**: Verifies Firebase JWT tokens in the `Authorization` header using Firebase Admin SDK. Includes CORS configuration and Rate Limiting.
- **TTS Proxy**: Provides a unified API to access multiple cloud TTS providers (Amazon Polly, Google Cloud, Azure). This hides API keys from the mobile client and allows for centralized usage tracking. Supports mock implementations for development.
- **Usage Tracker**: Logs character counts and estimated costs for cloud TTS requests in a PostgreSQL database (`tts_usage` table).
- **Pricing Service**: Provides logic to calculate costs based on character counts for different providers.
- **Rate Limiter**: Protects costly cloud TTS endpoints using Bucket4j, allowing 20 requests per minute per user.
- **Text Chunking**: Automatically splits long text into smaller segments for Cloud TTS providers, concatenating the results for a seamless experience.
- **File Processing**: Backend service for text extraction from PDF (using Apache PDFBox) and TXT files, providing a fallback for mobile-based extraction.

## CI/CD
- **GitHub Actions**: Automated workflows for building and testing both the Mobile and Backend components on every push or pull request.
- **Dockerization**: The backend and database are containerized using Docker and Docker Compose for easy deployment and local development.

## Data Flow

### On-Device TTS (Offline-First)
1. User selects a document or enters text.
2. User chooses a native voice/language.
3. React Native calls `react-native-tts`.
4. Native OS engines (iOS/Android) process text and play audio.

### Cloud TTS (Premium)
1. User selects a cloud voice.
2. Mobile app sends text and selected provider info to the Backend.
3. Backend verifies the user's Firebase token.
4. Backend proxies the request to the selected Cloud Provider (AWS/Google/Azure).
5. Provider returns audio stream.
6. Backend sends audio back to the Mobile App.
7. Mobile App plays or saves the audio.

## File Handling
- **PDF**: Uses `react-native-pdf` for rendering and text extraction libraries for processing content.
- **TXT**: Read directly as strings.
- **Audio**: Exported files are stored in the device's document directory and can be shared using `react-native-share`.

## Authentication
- Users log in via Google or Apple.
- Firebase handles the OAuth flow.
- The mobile app receives a JWT from Firebase.
- This JWT is sent in the `Authorization: Bearer <token>` header to the Spring Boot backend.
- The backend uses Firebase Admin SDK to verify the token.
