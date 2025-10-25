# Development Guide

## Environment Setup

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Environment Variables

Create `backend/.env`:

```env
# Add your environment variables here
```

## Development Workflow

1. **Start Development Servers**

   ```bash
   npm run dev
   ```

2. **Frontend Development**

   - Edit files in `frontend/src/`
   - Hot reload is enabled
   - Access at http://localhost:3000

3. **Backend Development**
   - Edit files in `backend/`
   - Hot reload is enabled
   - Access at http://localhost:8000
   - API docs at http://localhost:8000/docs

## Code Organization

### Frontend Structure

- `src/app/` - Next.js app directory (pages, layouts)
- `src/components/` - Reusable React components
- `src/services/` - API service layer
- `src/types/` - TypeScript type definitions

### Backend Structure

- `main.py` - FastAPI application entry point
- `models/` - Pydantic models (create this directory)
- `routers/` - API route modules (create this directory)
- `services/` - Business logic (create this directory)

## Adding New Features

### 1. Backend API Endpoint

```python
# In main.py or routers/
@app.post("/new-endpoint")
async def new_endpoint(data: YourModel):
    # Implementation
    return {"message": "Success"}
```

### 2. Frontend Component

```tsx
// In src/components/
export const NewComponent = () => {
  return <div>New Component</div>;
};
```

### 3. API Service Method

```typescript
// In src/services/api.ts
async newApiCall(): Promise<ResponseType> {
  return this.request<ResponseType>('/new-endpoint');
}
```

## Testing

### Frontend Testing

```bash
cd frontend
npm run test
```

### Backend Testing

```bash
cd backend
python -m pytest
```

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

### Backend Production

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Common Issues

### CORS Issues

- Ensure backend CORS is configured for frontend URL
- Check that frontend is making requests to correct backend URL

### Port Conflicts

- Frontend: Change port in `frontend/package.json`
- Backend: Change port in `backend/main.py` or command line

### TypeScript Errors

- Run `npm run type-check` in frontend directory
- Ensure all imports are properly typed
