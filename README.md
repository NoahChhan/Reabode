# Reabode Framework

A simple, modern full-stack framework combining React/Next.js frontend with FastAPI backend and Tailwind CSS for styling.

## 🚀 Features

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: FastAPI with Python 3.8+
- **Styling**: Tailwind CSS with custom components
- **API**: RESTful API with automatic documentation
- **Development**: Hot reload for both frontend and backend
- **Type Safety**: Full TypeScript support

## 📁 Project Structure

```
reabode/
├── frontend/                 # Next.js React application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # Reusable React components
│   │   └── services/         # API service layer
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # FastAPI Python application
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── package.json         # Development scripts
├── package.json             # Root package.json for dev scripts
└── README.md
```

## 🛠️ Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- pip (Python package manager)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (frontend, backend, and dev tools)
npm run install:all
```

### 2. Development Mode

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### 3. Manual Setup (Alternative)

If you prefer to set up manually:

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

The FastAPI backend automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /items` - Get all items
- `GET /items/{id}` - Get specific item
- `POST /items` - Create new item
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item

## 🎨 Components

The framework includes several reusable components:

### Button Component

```tsx
import { Button } from "@/components/Button";

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>;
```

### Input Component

```tsx
import { Input } from "@/components/Input";

<Input
  label="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>;
```

### Card Component

```tsx
import { Card } from "@/components/Card";

<Card title="My Card" subtitle="Card description">
  <p>Card content</p>
</Card>;
```

## 🔧 Development Scripts

### Root Level Scripts

- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install all dependencies
- `npm run build` - Build frontend for production
- `npm run start` - Start production servers

### Frontend Scripts (in frontend/)

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run start` - Production server
- `npm run lint` - Run ESLint

### Backend Scripts (in backend/)

- `npm run dev` - Development server with hot reload
- `npm run start` - Production server
- `npm run install` - Install Python dependencies

## 🌐 Environment Configuration

### Frontend Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Environment

Create `backend/.env`:

```env
# Add your environment variables here
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'out' directory
```

### Backend (Docker/Cloud)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🧪 Example Usage

The framework includes a complete Todo application demonstrating:

- CRUD operations
- API integration
- Component composition
- State management
- Form handling
- Error handling

## 📦 Adding New Features

### Backend (FastAPI)

1. Add new routes in `backend/main.py`
2. Create Pydantic models for request/response
3. Implement business logic
4. Test with the auto-generated docs

### Frontend (Next.js)

1. Create components in `src/components/`
2. Add API calls in `src/services/`
3. Use TypeScript interfaces for type safety
4. Style with Tailwind CSS classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
