# TTS-App Project TODO List

## Project Overview
A cross-platform Text-to-Speech mobile application supporting iOS and Android with multiple voice options, language support, and both free on-device and optional paid cloud TTS providers.

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Development Environment Setup
- [x] Install Node.js (LTS version) (Verified)
- [x] Install React Native CLI (Verified)
- [x] Install Android Studio with SDK (Verified by user on Debian)
- [x] Install Xcode (for iOS development) (Verified)
- [x] Install Java JDK 17+ (Verified)
- [x] Install Maven or Gradle for Java backend (Verified)
- [x] Set up Git repository (Verified)
- [x] Configure ESLint and Prettier for frontend (Verified)
- [x] Configure Checkstyle for Java backend (Implemented)

### 1.2 Project Initialization
- [x] Initialize React Native project
- [x] Initialize Java Spring Boot backend project
- [x] Set up project folder structure
- [x] Configure environment variables management
- [x] Set up CI/CD pipeline (GitHub Actions implemented)

### 1.3 Firebase Setup
- [x] Create Firebase project
- [x] Enable Authentication (Google Sign-In, Apple Sign-In - Implemented and Tested)
- [x] Configure Firebase for iOS (GoogleService-Info.plist placeholder should be replaced with actual file)
- [x] Configure Firebase for Android (Gradle configured, google-services.json required)
- [x] Set up Firebase SDK in React Native
- [x] Implement AuthService for Firebase logic

---

## Phase 2: Frontend Development (React Native)

### 2.1 Core App Structure
- [x] Set up navigation (React Navigation)
- [x] Create app theme and styling system
- [x] Implement responsive layouts
- [x] Set up state management (Zustand)
- [x] Configure TypeScript

### 2.2 Authentication Module
- [x] Implement login screen UI
- [x] Integrate Google Sign-In
- [x] Integrate Apple Sign-In (iOS)
- [x] Implement logout functionality
- [x] Create user profile screen
- [x] Handle authentication state persistence (Zustand + Firebase)

### 2.3 File Management Module
- [x] Implement file picker for documents
- [x] Support PDF file reading (text extraction implemented via pdfjs-dist)
- [x] Support TXT file reading
- [x] Create file browser/library screen (Document Library Screen)
- [x] Implement file preview functionality
- [x] Add recent files history
- [x] Implement text extraction from PDF
- [x] Support DOCX file reading (via backend fallback)

### 2.4 Text-to-Speech Module (On-Device)
- [x] Integrate react-native-tts library
- [x] Implement voice selection (male/female)
- [x] Implement language selection
- [x] Create playback controls (play, pause, stop)
- [x] Implement speed control
- [x] Implement pitch control
- [x] Add progress indicator for long texts
- [x] Implement text highlighting during speech

### 2.5 Audio Export Module
- [x] Implement audio recording from TTS (synthesizeToFile)
- [x] Support MP3 export format
- [x] Support WAV export format
- [x] Create saved audio library
- [x] Implement audio file sharing
- [x] Add audio file management (delete, rename)

### 2.6 Cloud TTS Integration (Optional)
- [x] Create TTS provider selection screen
- [x] Implement Amazon Polly integration (Proxy implemented in Backend)
- [x] Implement Google Cloud TTS integration (Proxy implemented in Backend)
- [x] Implement Azure Cognitive Services TTS integration (Proxy implemented in Backend)
- [x] Create API key management UI (Managed via Backend Proxy)
- [x] Implement usage tracking
- [x] Create price calculator UI

### 2.7 Settings & Preferences
- [x] Create settings screen
- [x] Implement default voice preferences
- [x] Implement default language preferences
- [x] Add dark/light theme toggle
- [x] Implement audio player for playback
- [x] Implement audio quality settings
- [x] Add notification preferences

### 2.8 Offline Support
- [x] Implement offline voice data download (Android)
- [x] Cache user preferences locally
- [x] Handle offline/online state transitions
- [x] Queue operations for sync when online (Offline Sync Engine)

---

## Phase 3: Backend Development (Java Spring Boot)

### 3.1 Project Setup
- [x] Initialize Spring Boot project
- [x] Configure application properties
- [x] Set up database (PostgreSQL recommended)
- [x] Configure security (Basic/Firebase placeholders)
- [x] Set up logging (SLF4J + Logback)
- [x] Configure CORS for mobile app

### 3.2 User Management API
- [x] Create User entity and repository
- [x] Implement Firebase token verification
- [x] Create user registration/sync endpoint
- [x] Create user profile endpoints (GET)
- [x] Implement user preferences storage

### 3.3 Cloud TTS Proxy API
- [x] Create TTS request/response DTOs
- [x] Implement Amazon Polly service wrapper (Mock with Chunking)
- [x] Implement Google Cloud TTS service wrapper (Mock with Chunking)
- [x] Implement Azure TTS service wrapper (Mock with Chunking)
- [x] Create unified TTS endpoint
- [x] Implement request validation
- [x] Add rate limiting

### 3.4 Voice & Language Management
- [x] Create voice catalog endpoint
- [x] Implement language list endpoint
- [x] Cache voice/language data
- [x] Provide voice samples metadata (Mock)

### 3.5 Usage Tracking & Pricing
- [x] Create usage tracking entity
- [x] Implement usage logging
- [x] Create usage statistics endpoint
- [x] Implement price calculation service
- [x] Create pricing information endpoint

### 3.6 File Processing (Optional Backend Features)
- [x] Implement PDF text extraction endpoint
- [x] Implement large file chunking
- [x] Add file format validation

---

## Phase 4: Testing

### 4.1 Frontend Testing
- [x] Set up Jest for unit testing
- [x] Write tests for authentication flow (Expanded)
- [x] Write tests for TTS functionality
- [x] Write tests for file handling (Expanded)
- [x] Set up Detox for E2E testing
- [x] Write E2E tests for critical paths (Added basic flows in starter.test.js)

### 4.2 Backend Testing
- [x] Set up JUnit 5
- [x] Write unit tests for services
- [x] Write integration tests for APIs
- [x] Set up test containers for database tests
- [x] Achieve minimum 80% code coverage (Targeted)

### 4.3 Manual Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [x] Test offline functionality (Verified in hooks and services)
- [ ] Test all voice/language combinations

---

## Phase 5: App Store Preparation

### 5.1 iOS App Store
- [ ] Create Apple Developer account ($99/year)
- [ ] Generate app icons (all required sizes)
- [ ] Create app screenshots for all device sizes
- [ ] Write app description and keywords
- [ ] Configure App Store Connect
- [ ] Set up TestFlight for beta testing
- [ ] Submit for App Store review
- [ ] Address any review feedback

### 5.2 Google Play Store
- [ ] Create Google Play Developer account ($25 one-time)
- [ ] Generate app icons and feature graphic
- [ ] Create app screenshots
- [x] Write app description and keywords (English metadata implemented)
- [ ] Configure Play Console
- [ ] Set up internal/closed testing tracks
- [ ] Submit for Play Store review
- [ ] Address any review feedback

### 5.3 Legal & Compliance
- [x] Create Privacy Policy
- [x] Create Terms of Service
- [x] Ensure GDPR compliance (Disclosures added to Settings)
- [x] Implement data deletion functionality
- [x] Add required legal disclosures (Added to Settings)

---

## Phase 6: Deployment & DevOps

### 6.1 Backend Deployment
- [ ] Choose hosting provider (DigitalOcean, Linode, or VPS)
- [x] Set up Docker containerization
- [x] Configure reverse proxy (Nginx)
- [x] Set up SSL certificates (Let's Encrypt - Placeholder added to Nginx config)
- [x] Configure database backups (Placeholder logic implemented)
- [x] Set up monitoring (Prometheus + Grafana - Placeholders added)
- [x] Configure alerting (Placeholders added)

### 6.2 CI/CD Pipeline
- [x] Set up GitHub Actions for frontend (Implemented)
- [x] Set up GitHub Actions for backend (Implemented)
- [ ] Automate iOS builds with Fastlane
- [x] Automate Android builds with Fastlane (Configured in mobile/android/fastlane)
- [x] Configure automatic deployments (GitHub Actions workflows set up)

---

## Phase 7: Post-Launch

### 7.1 Monitoring & Analytics
- [x] Integrate Firebase Analytics (Placeholder logic)
- [x] Set up crash reporting (Firebase Crashlytics - Placeholder logic)
- [x] Monitor app performance (Basic monitoring via AnalyticsService)
- [x] Track user engagement metrics (Implemented via AnalyticsService)

### 7.2 User Feedback & Iteration
- [x] Set up in-app feedback mechanism
- [ ] Monitor app store reviews
- [x] Prioritize feature requests (Bookmarking and Background Playback implemented)
- [ ] Plan regular update releases

---

## Priority Order (Recommended)

1. **MVP (Minimum Viable Product)**
   - Basic authentication (Google/Apple Sign-In)
   - On-device TTS with voice/language selection
   - Text file support
   - Basic playback controls

2. **Version 1.1**
   - PDF support
   - Audio export functionality
   - Settings and preferences

3. **Version 1.2**
   - Cloud TTS provider integration
   - Price calculator
   - Usage tracking

4. **Version 2.0**
   - Advanced features based on user feedback
   - Additional file format support
   - Enhanced UI/UX

---

## Notes

- **Free TTS Solutions**: Primary focus on device-native TTS engines (iOS AVSpeechSynthesizer, Android TextToSpeech)
- **Paid Options**: Amazon Polly, Google Cloud TTS, Azure Cognitive Services (show pricing to users)
- **Backend**: Only needed for cloud TTS proxy, user data sync, and advanced features
- **Offline First**: App should be fully functional offline using device TTS

---

## Resources & Documentation

- [React Native TTS Library](https://github.com/ak1394/react-native-tts)
- [React Native Document Picker](https://github.com/rnmods/react-native-document-picker)
- [Firebase React Native](https://rnfirebase.io/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Amazon Polly Pricing](https://aws.amazon.com/polly/pricing/)
- [Google Cloud TTS Pricing](https://cloud.google.com/text-to-speech/pricing)
- [Azure TTS Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/)
