# Dream Visualizer 🌟

AI-powered dream visualization app for the Adapty x FAL AI Hackathon 2025.

## 🎯 Overview

Dream Visualizer transforms your dreams into stunning AI-generated visualizations using advanced text-to-image technology. Users can record their dreams, choose from various artistic styles, and receive AI-powered dream analysis.

## ✨ Features

### Core Features (MVP)
- **Dream Input**: Text and voice recording support
- **AI Visualization**: FAL API integration for image generation
- **Style Selection**: Multiple artistic styles (Realistic, Anime, Painterly, Surreal, Minimalist)
- **AI Analysis**: Dream interpretation and analysis
- **Favorites**: Save and organize dream visualizations
- **Sharing**: Share dreams with friends and community

### Premium Features (Paywall)
- **Exclusive Styles**: Premium animation styles
- **AR Visualization**: Augmented reality dream viewing
- **High Resolution Export**: 4K quality downloads
- **Priority Processing**: Faster AI generation
- **Unlimited Storage**: Save unlimited dreams
- **No Watermarks**: Clean exports

## 🛠 Tech Stack

### Frontend (Mobile)
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **UI**: React Native Paper + Custom Components
- **Storage**: AsyncStorage
- **Animations**: Lottie + Reanimated
- **Paywall**: Adapty SDK

### Backend
- **Runtime**: Bun
- **Framework**: Hono
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: FAL API (Text-to-Image)
- **Analysis**: OpenAI API

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun (backend runtime) — `curl -fsSL https://bun.sh/install | bash`
- Expo CLI — `npm i -g expo` (optional, `npx expo` works too)
- EAS CLI (for dev client) — `npm i -g eas-cli`
- Android Studio (SDK + Emulator) or Xcode (iOS)
- Google Play Console / App Store Connect test accounts for IAP testing

### 1) Clone & install
```bash
git clone <repository-url>
cd dream-visualizer

# Mobile deps
npm install

# Backend deps
cd backend
bun install
```

### 2) Configure environment
- Backend: copy env and fill keys
```bash
cd backend
cp env.example .env
# Set values in .env:
# FAL_API_KEY=...
# OPENAI_API_KEY=...
# (If your backend calls Adapty Server API, set ADAPTY_SECRET_KEY=...)
```

- Mobile (Adapty public SDK key): set in `AdaptyConstans.js`
```js
// AdaptyConstans.js
export default {
  ADAPTY_API_KEY: "YOUR_PUBLIC_SDK_KEY", // Adapty Dashboard → App settings → General → API keys (Public)
  PLACEMENT_ID: "default" // or your placement id
};
```

### 3) Build an Expo Dev Client (required for Adapty)
Adapty uses native modules; Expo Go is not sufficient.
```bash
# From project root
expo install expo-dev-client react-native-adapty @adapty/react-native-ui

# Build dev client (choose one or both)
eas build --profile development --platform android
eas build --profile development --platform ios
```
When the build finishes, install the .apk/.aab (Android) or .ipa (iOS) on your device/emulator.

### 4) Run the project
```bash
# Terminal 1 - Backend
cd backend
bun run dev

# Terminal 2 - Mobile
cd ..
expo start --dev-client
```
Scan the QR (device) or run from Android Studio/Xcode using the Dev Client you installed.

### 5) In‑app purchase testing tips
- Android Emulator: use a Play Store–enabled image (Pixel API xx “Play Store”). Sign in to Play Store.
- In Google Play Console, add your tester account to License Testing or use internal testing. Products must be created and Active.
- iOS: use a real device with a Sandbox Apple ID. Configure IAP products in App Store Connect.
- Paywall is shown via Adapty; purchases flow through the store. Free option simply sets Standard plan.

### Troubleshooting
- If you see HTML in API responses (ngrok warning), ensure `ngrok-skip-browser-warning` header is sent (already set), and the tunnel URL points to your backend.
- If you get “Adapty can only be activated once”, Dev Client + Fast Refresh caused a double activate; we set `__ignoreActivationOnFastRefresh: __DEV__` to mitigate.

## 📱 App Structure

```
.
├── App.js
├── AdaptyConstans.js
├── app.json
├── eas.json
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── output-4.mp4
├── android/                 # Native Android project (autolinked)
├── backend/
│   ├── server.js / index.js # Backend entry
│   ├── env.example          # Copy to .env and fill keys
│   ├── package.json
│   └── uploads/             # Generated media
├── src/
│   ├── context/
│   │   └── UserContext.js
│   ├── services/
│   │   ├── AdaptyService.js
│   │   ├── api.js
│   │   └── authService.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── OnboardingScreen.js
│   │   ├── PaywallScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── LoginScreen.js
│   │   ├── DreamInputScreen.js
│   │   ├── VisualizationScreen.js
│   │   ├── GalleryScreen.js
│   │   ├── FavoritesScreen.js
│   │   ├── FavoriteDetailScreen.js
│   │   ├── EditProfileScreen.js
│   │   └── SettingsScreen.js
│   └── firebaseConfig.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 🔄 User Flow

1. **Onboarding**: Welcome screens with demo
2. **Paywall**: Premium features showcase
3. **Dream Input**: Text/voice recording with style selection
4. **Visualization**: AI generation with progress tracking
5. **Analysis**: AI-powered dream interpretation
6. **Favorites**: Save and organize dreams
7. **Sharing**: Social sharing capabilities

## 🎨 Visualization Styles

- **Realistic** 🎭: Photorealistic dream scenes
- **Anime** 🎌: Japanese animation style
- **Painterly** 🎨: Artistic painting aesthetic
- **Surreal** 🌌: Abstract and dreamlike
- **Minimalist** ⚪: Clean and simple design

## 🔧 API Endpoints

- `POST /api/dreams/submit` - Submit dream for processing
- `POST /api/visualize/generate` - Generate AI visualization
- `POST /api/dreams/analyze` - Get AI dream analysis
- `GET /api/favorites/:userId` - Get user favorites
- `POST /api/dreams/share` - Share dream

## 💰 Monetization Strategy

### Free Tier
- 3 dreams per day
- Basic styles only
- Standard resolution
- Watermarked exports

### Premium Tier ($9.99/month)
- Unlimited dreams
- All premium styles
- 4K exports
- Priority processing
- No watermarks

## 🏆 Hackathon Criteria

- **Paywall & Monetization (25%)**: Adapty SDK integration
- **Onboarding Flow (20%)**: Smooth user introduction
- **Best AI Feature (30%)**: FAL API implementation
- **Best Demo & Storytelling (25%)**: Compelling user experience

## 📅 Development Timeline

### Day 1
- ✅ Mobile app structure
- ✅ Backend API skeleton
- ✅ Basic screens and navigation

### Day 2
- 🔄 FAL API integration
- 🔄 AI dream analysis
- 🔄 Adapty paywall setup

### Day 3
- ⏳ Favorites system
- ⏳ Sharing functionality
- ⏳ Demo preparation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FAL AI for text-to-image generation
- Adapty for paywall integration
- OpenAI for dream analysis
- React Native community

## 🤝 Contributors
- @damlalper

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

**Built with ❤️ for the Adapty x FAL AI Hackathon 2025**
