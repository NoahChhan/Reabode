# Reabode AI Interior Designer 🏠✨

An AI-powered mobile app that analyzes your room photos and provides personalized furniture and decor recommendations from real retailers like IKEA and Target.

## 🚀 Features

- **AI Room Analysis**: Upload room photos and get instant style analysis
- **Smart Recommendations**: Get personalized product suggestions based on your space
- **Real Product Links**: Direct links to IKEA, Target, and other retailers
- **Mood Board Creation**: Visualize your design ideas
- **Real-time Collaboration**: Work with friends and family on designs
- **Mobile-First**: Built with React Native for iOS and Android

## 🛠️ Tech Stack

### Mobile App (React Native + Expo)
- **Frontend**: React Native with Expo
- **Navigation**: React Navigation
- **UI**: React Native Paper
- **Camera**: Expo Camera
- **Real-time**: LiveKit integration

### Backend (FastAPI + Python)
- **API**: FastAPI with automatic documentation
- **AI**: Claude API for image analysis
- **Vector DB**: Chroma for product embeddings
- **Automation**: Composio for product data
- **Real-time**: LiveKit for collaboration

## 📱 Mobile App Features

### Core Screens
- **Home**: Project overview and quick actions
- **Camera**: Room photo capture and gallery selection
- **Analysis**: Room dimensions and style preferences
- **Recommendations**: Product suggestions with filtering
- **Profile**: Settings and preferences

### Key Components
- Camera integration with image capture
- Swipeable product cards
- Real-time room analysis
- Product filtering and search
- Favorites and shopping cart

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Quick Start

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This starts both the FastAPI backend (port 8000) and Expo mobile app.

3. **Access the App**
   - **Mobile**: Scan QR code with Expo Go app
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs

### Manual Setup

#### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Mobile App
```bash
cd mobile
npm install
expo start
```

## 🎯 Hackathon Implementation Plan

### Phase 1: Foundation (Hours 1-4)
- ✅ Mobile app structure with navigation
- ✅ Camera integration for room photos
- ✅ Basic room analysis API
- ✅ UI components and theme

### Phase 2: AI Integration (Hours 5-8)
- 🔄 Claude API integration for image analysis
- 🔄 Room analysis with style detection
- 🔄 Product recommendation engine
- 🔄 Chroma vector database setup

### Phase 3: Product Integration (Hours 9-12)
- ⏳ Target/IKEA API integration via Composio
- ⏳ Real product data and links
- ⏳ Product filtering and search
- ⏳ Shopping cart functionality

### Phase 4: Advanced Features (Hours 13-18)
- ⏳ LiveKit real-time collaboration
- ⏳ Mood board creation
- ⏳ AR product preview
- ⏳ Demo preparation and testing

## 🔌 API Endpoints

### Core Endpoints
- `POST /analyze-room` - Analyze room images with AI
- `POST /recommendations` - Get product recommendations
- `GET /projects` - List design projects
- `POST /projects` - Create new project
- `POST /products/search` - Search products
- `POST /mood-board` - Create mood board
- `POST /collaboration/join` - Join collaboration room

### Mobile-Specific Features
- Image upload with base64 encoding
- Real-time analysis progress
- Product filtering and favorites
- Offline project storage

## 🎨 Design System

### Colors
- Primary: Indigo (#6366f1)
- Secondary: Amber (#f59e0b)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Background: Light Gray (#f1f5f9)

### Components
- **Cards**: Product displays and project overviews
- **Chips**: Style and color selection
- **Buttons**: Primary actions and navigation
- **FABs**: Quick actions and shopping cart
- **Progress**: Analysis and loading states

## 📦 Dependencies

### Mobile (React Native)
- Expo SDK 50
- React Navigation 6
- React Native Paper
- Expo Camera
- Expo Image Picker
- LiveKit React Native

### Backend (Python)
- FastAPI 0.104
- Claude API (Anthropic)
- ChromaDB for vector storage
- Composio for automation
- LiveKit for real-time features

## 🚀 Deployment

### Mobile App
```bash
# Build for production
npm run build:mobile

# Deploy to app stores
expo build:android
expo build:ios
```

### Backend API
```bash
# Production server
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🤝 Team Collaboration

### Development Workflow
1. **Frontend + Backend in Parallel**: Test features immediately
2. **Visual Feedback**: See AI results in real-time
3. **Mobile-First**: Camera and touch interactions from day one
4. **Rapid Iteration**: Quick feedback loops for AI improvements

### Key Advantages
- **Faster Development**: Visual testing of AI features
- **Better UX**: Mobile-optimized interactions
- **Easier Debugging**: See what's happening in real-time
- **Impressive Demos**: Working mobile app with AI features

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon Goals

- **Innovation**: AI-powered interior design recommendations
- **Technical**: Mobile app with real-time AI analysis
- **User Experience**: Intuitive camera-based workflow
- **Integration**: Multiple sponsor APIs (Claude, Composio, Chroma, LiveKit)
- **Demo**: Live mobile app demonstration

---

**Built with ❤️ for hackathon success!**