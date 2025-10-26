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

- **Framework**: React Native 0.81.5 with Expo SDK 54
- **Navigation**: React Navigation 6 (Stack & Bottom Tabs)
- **UI Components**: React Native Paper 5.11.0
- **Camera**: Expo Camera 17.0.8 & Expo Image Picker 17.0.8
- **Gestures**: React Native Gesture Handler & Reanimated
- **Icons**: React Native Vector Icons 10.0.0
- **Fonts**: Custom fonts (Poppins, Moonlight) via Expo Font
- **State Management**: React Hooks & Context API
- **TypeScript**: Full TypeScript support

### Frontend Web (Next.js)

- **Framework**: Next.js 16.0.0 with React 19.2.0
- **Styling**: Tailwind CSS 4.0 with PostCSS
- **TypeScript**: TypeScript 5.x with strict type checking
- **Linting**: ESLint 9 with Next.js configuration
- **Build**: Next.js built-in bundling and optimization

### Backend (FastAPI + Python)

- **API Framework**: FastAPI 0.104.1 with automatic OpenAPI docs
- **Server**: Uvicorn 0.24.0 with ASGI support
- **AI Services**: Google Gemini AI (google-generativeai 0.3.2)
- **Image Processing**: Pillow 10.2.0+ for image manipulation
- **Web Scraping**: Selenium 4.15.2 with WebDriver Manager
- **Data Validation**: Pydantic 2.8.2 for request/response models
- **Authentication**: Python-JOSE with cryptography
- **Security**: Passlib with bcrypt for password hashing
- **Environment**: Python-dotenv for configuration management
- **HTTP Client**: Requests 2.31.0 for external API calls
- **CORS**: FastAPI CORS middleware for cross-origin requests

### Development & Build Tools

- **Package Management**: npm with package-lock.json
- **Concurrent Development**: concurrently 8.2.2 for parallel dev servers
- **TypeScript**: TypeScript 5.x across all TypeScript projects
- **Babel**: Babel preset Expo for React Native compilation
- **Linting**: ESLint with Next.js and React Native configurations

## 🏗️ Project Architecture

### Multi-Platform Structure

This project consists of three main applications working together:

1. **Mobile App** (`/mobile`) - Primary user interface

   - React Native with Expo for iOS/Android
   - Camera integration for room photo capture
   - Real-time AI analysis and product recommendations
   - Offline-first design with local storage

2. **Web Frontend** (`/frontend`) - Administrative dashboard

   - Next.js with Tailwind CSS for modern web interface
   - Project management and analytics
   - Content management for product catalogs

3. **Backend API** (`/backend`) - Core services
   - FastAPI with automatic API documentation
   - AI-powered room analysis using Google Gemini
   - Product scraping and recommendation engine
   - RESTful API serving both mobile and web clients

### Key Features Implemented

- **Room Blueprint Generation**: Computer vision pipeline for 2D room layouts
- **AI Room Analysis**: Style detection and furniture identification
- **Product Recommendations**: IKEA scraping and matching algorithms
- **Real-time Processing**: Live image analysis and instant feedback
- **Cross-platform Sync**: Shared API backend for consistent data

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


## 🔌 API Endpoints

### Core Endpoints

- `POST /analyze-room` - Analyze room images with AI
- `POST /recommendations` - Get product recommendations
- `GET /projects` - List design projects
- `POST /projects` - Create new project
- `POST /products/search` - Search products
- `POST /mood-board` - Create mood board
- `POST /collaboration/join` - Join collaboration room



## 📦 Dependencies

### Mobile (React Native)

- **Core**: Expo SDK 54, React Native 0.81.5, React 19.1.0
- **Navigation**: React Navigation 6 (Native, Stack, Bottom Tabs)
- **UI**: React Native Paper 5.11.0, Vector Icons 10.0.0
- **Camera**: Expo Camera 17.0.8, Expo Image Picker 17.0.8
- **Gestures**: React Native Gesture Handler 2.28.0, Reanimated 4.1.1
- **Media**: Expo AV 16.0.7, Expo Linear Gradient 15.0.7
- **Utilities**: Expo Font 13.0.3, Expo Haptics 15.0.7, Expo Status Bar 3.0.8
- **Development**: TypeScript 5.1.3, Babel Core 7.20.0

### Frontend Web (Next.js)

- **Core**: Next.js 16.0.0, React 19.2.0, React DOM 19.2.0
- **Styling**: Tailwind CSS 4.0, PostCSS 4.0
- **TypeScript**: TypeScript 5.x, Node Types 20, React Types 19
- **Linting**: ESLint 9, ESLint Config Next 16.0.0

### Backend (Python)

- **API**: FastAPI 0.104.1, Uvicorn 0.24.0, Pydantic 2.8.2
- **AI**: Google Generative AI 0.3.2 (Gemini)
- **Image Processing**: Pillow 10.2.0+
- **Web Scraping**: Selenium 4.15.2, WebDriver Manager 4.0.1
- **Security**: Python-JOSE 3.3.0, Passlib 1.7.4
- **Utilities**: Python-dotenv 1.0.0, Requests 2.31.0, Python-multipart 0.0.6

### Development Tools

- **Concurrency**: concurrently 8.2.2 for parallel development
- **Package Management**: npm with lock files across all projects

## 🚀 Deployment

### Mobile App

```bash
# Build for production
npx expo start --tunnel

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

### Key Advantages

- **Faster Development**: Visual testing of AI features
- **Better UX**: Mobile-optimized interactions
- **Easier Debugging**: See what's happening in real-time
- **Impressive Demos**: Working mobile app with AI features

## 📄 License

MIT License - see LICENSE file for details
