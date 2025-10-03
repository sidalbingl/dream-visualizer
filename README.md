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
- Bun (for backend)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DreamVisualizer
   ```

2. **Install dependencies**
   ```bash
   # Install mobile dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   bun install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cd backend
   cp env.example .env
   
   # Edit .env with your API keys
   # - FAL_API_KEY: Get from fal.ai
   # - OPENAI_API_KEY: Get from OpenAI
   # - ADAPTY_API_KEY: Get from Adapty
   ```

4. **Start the development servers**
   ```bash
   # Start backend (Terminal 1)
   cd backend
   bun run dev
   
   # Start mobile app (Terminal 2)
   npm start
   ```

## 📱 App Structure

```
src/
├── screens/           # Main app screens
│   ├── SplashScreen.js
│   ├── OnboardingScreen.js
│   ├── DreamInputScreen.js
│   ├── VisualizationScreen.js
│   ├── FavoritesScreen.js
│   └── PaywallScreen.js
├── components/        # Reusable components
├── services/          # API and external services
├── utils/            # Utility functions
└── types/            # Type definitions

backend/
├── index.js          # Main server file
├── routes/           # API routes
├── models/           # Database models
└── services/         # External API integrations
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FAL AI for text-to-image generation
- Adapty for paywall integration
- OpenAI for dream analysis
- React Native community

## 10) Contributors
- @damlalper

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

**Built with ❤️ for the Adapty x FAL AI Hackathon 2025**
