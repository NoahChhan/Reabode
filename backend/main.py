from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import base64
import json
import os
from datetime import datetime
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import Gemini service
from services.gemini_service import gemini_service
from services.product_service import product_service

app = FastAPI(title="Reabode AI Interior Designer API", version="1.0.0")

# Configure CORS for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for mobile development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for AI Interior Designer
class RoomImage(BaseModel):
    id: str
    uri: str
    base64: Optional[str] = None
    timestamp: int

class RoomDimensions(BaseModel):
    length: float
    width: float
    height: float
    unit: str = "feet"

class MoodPreferences(BaseModel):
    style: List[str] = []
    colors: List[str] = []
    budget: str = "medium"  # low, medium, high
    adjectives: List[str] = []

class RoomAnalysis(BaseModel):
    roomType: str
    currentStyle: str
    colorScheme: List[str]
    furniture: List[str]
    improvements: List[str]
    confidence: float

class ProductRecommendation(BaseModel):
    id: str
    name: str
    brand: str
    price: float
    currency: str = "USD"
    imageUrl: str
    productUrl: str
    category: str
    style: str
    colors: List[str]
    dimensions: Optional[Dict[str, float]] = None
    matchScore: float
    description: str

class DesignProject(BaseModel):
    id: str
    name: str
    roomImages: List[RoomImage]
    dimensions: RoomDimensions
    moodPreferences: MoodPreferences
    analysis: Optional[RoomAnalysis] = None
    recommendations: List[ProductRecommendation] = []
    createdAt: int
    updatedAt: int

class RecommendationRequest(BaseModel):
    analysis: RoomAnalysis
    budget: str
    style: List[str]

# In-memory storage (replace with database in production)
projects_db: Dict[str, DesignProject] = {}

@app.get("/")
async def root():
    return {"message": "Welcome to Reabode AI Interior Designer API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Room Analysis Endpoint
@app.post("/analyze-room", response_model=RoomAnalysis)
async def analyze_room(
    images: List[RoomImage],
    dimensions: RoomDimensions,
    moodPreferences: MoodPreferences
):
    """
    Analyze room images using Gemini AI to determine room type, style, and recommendations
    """
    try:
        # Use first image for analysis
        if not images or len(images) == 0:
            raise HTTPException(status_code=400, detail="No images provided")
        
        first_image = images[0]
        image_data = first_image.base64 or first_image.uri
        
        # Call Gemini service
        analysis_data = gemini_service.analyze_room_image(image_data)
        
        # Convert to RoomAnalysis model
        analysis = RoomAnalysis(
            roomType=analysis_data.get("roomType", "Unknown"),
            currentStyle=analysis_data.get("currentStyle", "Modern"),
            colorScheme=analysis_data.get("colorScheme", []),
            furniture=analysis_data.get("furniture", []),
            improvements=analysis_data.get("improvements", []),
            confidence=analysis_data.get("confidence", 0.8)
        )
        
        return analysis
        
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Product Recommendations
@app.post("/recommendations", response_model=List[ProductRecommendation])
async def get_recommendations(request: RecommendationRequest):
    """
    Get product recommendations based on room analysis using ProductService
    """
    try:
        # Get matched products using ProductService
        matched_products = product_service.match_products(
            room_type=request.analysis.roomType,
            style_preferences=request.style,
            color_preferences=request.analysis.colorScheme,
            budget=request.budget,
            limit=10
        )
        
        # Convert to ProductRecommendation models
        recommendations = []
        for product in matched_products:
            recommendation = ProductRecommendation(
                id=product['id'],
                name=product['name'],
                brand=product['brand'],
                price=product['price'],
                currency=product['currency'],
                imageUrl=product['imageUrl'],
                productUrl=product['productUrl'],
                category=product['category'],
                style=', '.join(product.get('style', [])),
                colors=product['colors'],
                dimensions=product.get('dimensions'),
                matchScore=product['matchScore'],
                description=product['description']
            )
            recommendations.append(recommendation)
        
        return recommendations
        
    except Exception as e:
        print(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendations failed: {str(e)}")

# Design Projects CRUD
@app.post("/projects", response_model=DesignProject)
async def create_project(project_data: dict):
    """Create a new design project"""
    project_id = str(uuid.uuid4())
    now = int(datetime.now().timestamp())
    
    project = DesignProject(
        id=project_id,
        name=project_data.get("name", "New Project"),
        roomImages=project_data.get("roomImages", []),
        dimensions=project_data.get("dimensions"),
        moodPreferences=project_data.get("moodPreferences"),
        createdAt=now,
        updatedAt=now
    )
    
    projects_db[project_id] = project
    return project

@app.get("/projects", response_model=List[DesignProject])
async def get_projects():
    """Get all design projects"""
    return list(projects_db.values())

@app.get("/projects/{project_id}", response_model=DesignProject)
async def get_project(project_id: str):
    """Get a specific project"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects_db[project_id]

@app.put("/projects/{project_id}", response_model=DesignProject)
async def update_project(project_id: str, updates: dict):
    """Update a project"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    for key, value in updates.items():
        if hasattr(project, key):
            setattr(project, key, value)
    
    project.updatedAt = int(datetime.now().timestamp())
    projects_db[project_id] = project
    return project

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    del projects_db[project_id]
    return {"message": "Project deleted successfully"}

# Product Search
@app.post("/products/search", response_model=List[ProductRecommendation])
async def search_products(query: str, filters: dict = None):
    """Search for products"""
    # TODO: Implement product search with real APIs
    return []

# Mood Board
@app.post("/mood-board")
async def create_mood_board(data: dict):
    """Create a mood board"""
    # TODO: Implement mood board creation
    return {"id": str(uuid.uuid4()), "url": "https://example.com/moodboard.jpg"}

# Collaboration
@app.post("/collaboration/join")
async def join_room(data: dict):
    """Join a collaboration room"""
    # TODO: Implement LiveKit integration
    return {"token": "mock_token", "url": "wss://example.com/room"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
