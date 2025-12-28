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

#### Quick Setup with Scripts (Recommended)

We provide shell scripts to simplify the setup and running process:

```bash
# iOS Setup and Run (macOS only)
./scripts/setup-ios.sh    # Install all dependencies
./scripts/run-ios.sh      # Start the iOS Simulator with the app
```

#### Manual Setup

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

### 📱 Running on iOS Simulator (macOS only)

#### Prerequisites
- macOS (required for iOS development)
- Xcode 14+ installed from the App Store
- Xcode Command Line Tools (`xcode-select --install`)
- Node.js 20+ ([download](https://nodejs.org/) or install via `brew install node`)
- CocoaPods (will be installed automatically by setup script if missing)

#### Option 1: Using Shell Scripts (Recommended)

**Step 1: Setup the development environment**
```bash
# From the project root directory
./scripts/setup-ios.sh
```

This script will:
- Verify all prerequisites (Xcode, Node.js, CocoaPods)
- Install Node.js dependencies (`npm install`)
- Install CocoaPods dependencies (`pod install`)

**Step 2: Run the app on iOS Simulator**
```bash
# Run on default simulator
./scripts/run-ios.sh

# List available simulators
./scripts/run-ios.sh --list

# Run on a specific simulator
./scripts/run-ios.sh --simulator "iPhone 15"
./scripts/run-ios.sh --simulator "iPhone 15 Pro Max"

# Run in release mode
./scripts/run-ios.sh --release
```

**Script Options:**
| Option | Description |
|--------|-------------|
| `--list` | List all available iOS simulators |
| `--simulator NAME` | Specify simulator by name (e.g., "iPhone 15") |
| `--device ID` | Specify simulator by device ID |
| `--release` | Build and run in release mode |
| `--help` | Show help message |

#### Option 2: Manual Steps

```bash
# 1. Install dependencies
cd mobile
npm install

# 2. Install CocoaPods dependencies
cd ios
pod install
cd ..

# 3. Start Metro bundler (in a separate terminal)
npm start

# 4. Run on iOS Simulator (in another terminal)
npm run ios

# Or specify a simulator
npx react-native run-ios --simulator="iPhone 15"
```

#### Troubleshooting iOS

| Issue | Solution |
|-------|----------|
| "Command Line Tools not found" | Run `xcode-select --install` |
| "CocoaPods not found" | Run `sudo gem install cocoapods` |
| Pod install fails | Try `cd mobile/ios && pod install --repo-update` |
| Build fails with signing error | Open `mobile/ios/mobile.xcworkspace` in Xcode and configure signing |
| Simulator not starting | Open Xcode > Settings > Platforms > Download iOS Simulator |
| Metro bundler port in use | Kill the process on port 8081: `lsof -ti:8081 \| xargs kill` |

#### 3. Backend Setup
```bash
cd backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

### Environment Configuration

#### Mobile App - Firebase Setup

This app uses [React Native Firebase](https://rnfirebase.io/) which requires native configuration files (not `.env` files).

##### iOS Setup (GoogleService-Info.plist)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click "Add app" and select iOS
4. Enter your iOS bundle ID: `io.github.ozkanpakdil.ttsapp` (or your custom bundle ID)
5. Download the `GoogleService-Info.plist` file
6. Place it in: `mobile/ios/mobile/GoogleService-Info.plist`

**Important:** The bundle ID in your Xcode project must match the bundle ID registered in Firebase. To check/change it:
- Open `mobile/ios/mobile.xcworkspace` in Xcode
- Select the project in the navigator
- Under "Signing & Capabilities", verify the Bundle Identifier matches your Firebase app

##### Android Setup (google-services.json)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Add app" and select Android
4. Enter your Android package name: `com.mobile` (or your custom package name)
5. Download the `google-services.json` file
6. Place it in: `mobile/android/app/google-services.json`

##### After Adding Firebase Config Files

After placing the configuration files, rebuild the app:
```bash
# iOS
cd mobile/ios && pod install && cd ..
./scripts/run-ios.sh

# Android
cd mobile && npm run android
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
