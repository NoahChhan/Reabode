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
    Analyze room images using AI to determine room type, style, and recommendations
    """
    try:
        # TODO: Integrate with Claude API for image analysis
        # For now, return mock analysis
        analysis = RoomAnalysis(
            roomType="Living Room",
            currentStyle="Modern",
            colorScheme=["white", "gray", "blue"],
            furniture=["sofa", "coffee table", "tv stand"],
            improvements=["add plants", "better lighting", "colorful accents"],
            confidence=0.85
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Product Recommendations
@app.post("/recommendations", response_model=List[ProductRecommendation])
async def get_recommendations(
    analysis: RoomAnalysis,
    budget: str,
    style: List[str]
):
    """
    Get product recommendations based on room analysis
    """
    try:
        # TODO: Integrate with Chroma vector database and product APIs
        # For now, return mock recommendations
        recommendations = [
            ProductRecommendation(
                id="1",
                name="Modern Sectional Sofa",
                brand="IKEA",
                price=899.99,
                imageUrl="https://example.com/sofa.jpg",
                productUrl="https://ikea.com/sofa",
                category="Furniture",
                style="Modern",
                colors=["gray", "white"],
                matchScore=0.92,
                description="Perfect modern sectional for your living room"
            ),
            ProductRecommendation(
                id="2",
                name="Glass Coffee Table",
                brand="Target",
                price=299.99,
                imageUrl="https://example.com/table.jpg",
                productUrl="https://target.com/table",
                category="Furniture",
                style="Modern",
                colors=["clear", "white"],
                matchScore=0.88,
                description="Sleek glass coffee table to complement your space"
            )
        ]
        return recommendations
    except Exception as e:
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
