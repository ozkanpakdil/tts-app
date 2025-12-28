# TTS-App - Text-to-Speech Mobile Application

A cross-platform mobile application that converts text to speech with support for multiple voices, languages, and both free on-device and optional premium cloud-based TTS providers.

## 🎯 Features

### Core Features
- **Multi-Platform Support**: iOS and Android via React Native
- **On-Device TTS**: Free, offline text-to-speech using native device engines
- **Multiple Voices**: Male and female voice options
- **Multi-Language Support**: Support for various languages based on device capabilities
- **File Support**: Read text from PDF and TXT files
- **Audio Export**: Save speech as MP3 or WAV files for later playback

### Authentication
- Google Sign-In
- Apple Sign-In (iOS)
- Firebase Authentication backend

### Cloud TTS Options (Optional)
- Amazon Polly integration
- Google Cloud Text-to-Speech integration
- Azure Cognitive Services Speech integration
- Built-in price calculator for cloud services

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Auth     │  │  File Mgmt  │  │    TTS Engine       │  │
│  │  (Firebase) │  │  (PDF/TXT)  │  │  (On-Device/Cloud)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Settings  │  │Audio Export │  │  Price Calculator   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ (Optional - for Cloud TTS)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Java Spring Boot)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  User API   │  │  TTS Proxy  │  │  Usage Tracking     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  Amazon  │   │  Google  │   │  Azure   │
        │  Polly   │   │Cloud TTS │   │   TTS    │
        └──────────┘   └──────────┘   └──────────┘
```

## 📁 Project Structure

```
tts-app/
├── mobile/                    # React Native mobile app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # App screens
│   │   ├── services/          # Business logic & API calls
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # State management
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript type definitions
│   ├── ios/                   # iOS native code
│   ├── android/               # Android native code
│   └── package.json
│
├── backend/                   # Java Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/ttsapp/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── dto/
│   │   │   │       └── config/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── docs/                      # Additional documentation
├── TODO.md                    # Project task list
├── ARCHITECTURE.md            # Detailed architecture docs
├── PRICING.md                 # TTS provider pricing info
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

#### For Mobile Development (Android)
- Android Studio with SDK 33+
- `ANDROID_HOME` environment variable configured
- `google-services.json` placed in `mobile/android/app/` (get from Firebase Console)

#### For Mobile Development (iOS)
- Xcode 14+ (for iOS development, macOS only)
- CocoaPods (for iOS)

#### For Backend Development
- Java JDK 17+
- Maven 3.8+
- PostgreSQL 14+ (or Docker)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tts-app.git
cd tts-app
```

### Mobile App Setup
```bash
cd mobile
npm install

# Android specific
cd android
# Build debug APK
./gradlew assembleDebug
# Or use Fastlane
fastlane build_debug

# iOS specific (macOS only)
cd ../ios && pod install && cd ..
```

#### 3. Backend Setup
```bash
cd backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

### Environment Configuration

#### Mobile App (.env)
```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# Backend API
API_BASE_URL=https://your-backend-url.com/api

# Optional: Cloud TTS (if using backend proxy)
ENABLE_CLOUD_TTS=false
```

#### Backend (application.yml)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ttsapp
    username: postgres
    password: your_password

# Cloud TTS Credentials (Optional)
aws:
  polly:
    access-key: your_access_key
    secret-key: your_secret_key
    region: us-east-1

google:
  cloud:
    tts:
      credentials-path: /path/to/credentials.json

azure:
  cognitive:
    speech:
      key: your_subscription_key
      region: eastus
```

## 📱 App Screens

1. **Login Screen** - Google/Apple Sign-In
2. **Home Screen** - Quick access to TTS, recent files
3. **File Browser** - Browse and select documents
4. **Reader Screen** - View text with TTS controls
5. **Voice Settings** - Select voice, language, speed, pitch
6. **Audio Library** - Saved audio files
7. **Settings** - App preferences, cloud TTS setup
8. **Price Calculator** - Compare cloud TTS costs

## 🔊 Supported TTS Engines

### Free (On-Device)
| Platform | Engine | Languages | Voices |
|----------|--------|-----------|--------|
| iOS | AVSpeechSynthesizer | 50+ | Multiple per language |
| Android | Android TTS | 50+ | Multiple per language |

### Premium (Cloud-Based)
| Provider | Languages | Voice Types | Neural Voices |
|----------|-----------|-------------|---------------|
| Amazon Polly | 29 | Standard, Neural | Yes |
| Google Cloud TTS | 40+ | Standard, WaveNet, Neural2 | Yes |
| Azure TTS | 140+ | Standard, Neural | Yes |

## 💰 Pricing

See [PRICING.md](./PRICING.md) for detailed pricing information for cloud TTS providers.

**Quick Summary:**
- **On-Device TTS**: FREE (unlimited)
- **Amazon Polly**: $4.00 per 1M characters (Standard)
- **Google Cloud TTS**: $4.00 per 1M characters (Standard)
- **Azure TTS**: $4.00 per 1M characters (Neural)

## 🧪 Testing

### Mobile App
```bash
cd mobile

# Unit tests
npm test

# E2E tests (requires running emulator/simulator)
npm run e2e:ios
npm run e2e:android
```

### Backend
```bash
cd backend

# Run all tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report
```

## 📦 Building for Production

### iOS
```bash
cd mobile/ios
xcodebuild -workspace TTSApp.xcworkspace -scheme TTSApp -configuration Release
```

### Android
```bash
cd mobile/android
./gradlew assembleRelease
```

### Backend
```bash
cd backend
./mvnw clean package -DskipTests
# JAR file will be in target/tts-backend-1.0.0.jar
```

## 🚢 Deployment

### Backend Deployment (Docker)
```bash
cd backend
docker build -t tts-backend .
docker run -p 8080:8080 tts-backend
```

### App Store Deployment
- See [TODO.md](./TODO.md) Phase 5 for detailed app store submission steps

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Create an issue for bug reports or feature requests
- Email: support@ttsapp.com (placeholder)

## 🗺️ Roadmap

See [TODO.md](./TODO.md) for the complete project roadmap and task list.

### Upcoming Features
- [ ] Bookmarking in documents
- [ ] Background playback
- [ ] Widget support
- [ ] Apple Watch companion app
- [ ] Wear OS companion app
- [ ] EPUB file support
- [ ] DOCX file support
