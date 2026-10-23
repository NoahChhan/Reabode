"""
FastAPI Recommendation Route
Handles product recommendations based on Gemini AI analysis
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from services.product_service import product_service
from services.match_utils import product_matcher

router = APIRouter()

class GeminiAnalysisRequest(BaseModel):
    """Request model for Gemini AI analysis data"""
    room_type: str
    style: str
    color_scheme: List[str]
    furniture_identified: List[str]
    improvement_suggestions: List[str]

class ProductRecommendation(BaseModel):
    """Response model for product recommendations"""
    match_type: str
    category: str
    name: str
    price: Optional[float]
    currency: str
    color: List[str]
    image: str
    url: str
    match_score: int
    dimensions: List[Dict]

class RecommendationResponse(BaseModel):
    """Response model for the recommendation endpoint"""
    recommendations: List[ProductRecommendation]
    total_found: int
    search_keywords: List[str]

@router.post("/api/recommend_products", response_model=RecommendationResponse)
async def recommend_products(request: GeminiAnalysisRequest):
    """
    Generate product recommendations based on Gemini AI analysis
    
    Args:
        request: Gemini analysis data including room type, style, colors, furniture, and improvements
        
    Returns:
        List of ranked product recommendations with match scores
    """
    try:
        # Convert request to dict for processing
        gemini_data = {
            "room_type": request.room_type,
            "style": request.style,
            "color_scheme": request.color_scheme,
            "furniture_identified": request.furniture_identified,
            "improvement_suggestions": request.improvement_suggestions
        }
        
        # Generate search terms from Gemini analysis for logging/debugging
        search_terms = [
            f"{gemini_data.get('room_type', '')} furniture",
            f"{gemini_data.get('style', '')} furniture"
        ] + gemini_data.get('furniture_identified', [])
        search_terms = [term for term in search_terms if term.strip()]
        
        # Get products from hardcoded data using ProductService
        products = product_service.match_products(
            room_type=gemini_data.get('room_type', 'living room'),
            style_preferences=[gemini_data.get('style', 'modern')],
            color_preferences=gemini_data.get('color_scheme', []),
            budget='medium',  # Default to medium budget
            furniture_preferences=gemini_data.get('furniture_identified', []),
            additional_info=gemini_data.get('improvement_suggestions', []),
            limit=15
        )
        
        if not products:
            return RecommendationResponse(
                recommendations=[],
                total_found=0,
                search_keywords=search_terms
            )
        
        # Products are already scored and sorted by ProductService
        # Filter out products with no match score
        scored_products = [
            {
                "product": product,
                "score": product.get('matchScore', 0),
                "match_type": "style_match" if product.get('matchScore', 0) > 0.5 else "category_match"
            }
            for product in products
            if product.get('matchScore', 0) > 0
        ]
        
        # Take top recommendations (already sorted by ProductService)
        top_products = scored_products
        
        # Format recommendations
        recommendations = []
        for item in top_products:
            product = item["product"]
            match_type = item["match_type"]
            score = item["score"]
            
            # Use product category from hardcoded data
            category = product.get("category", "Furniture")
            
            # Format dimensions from hardcoded data
            dimensions = []
            if product.get("dimensions"):
                dims = product["dimensions"]
                dimensions.append({
                    "type": "height",
                    "value": str(dims.get("height", "")),
                    "unit": dims.get("unit", "inches")
                })
                dimensions.append({
                    "type": "width", 
                    "value": str(dims.get("width", "")),
                    "unit": dims.get("unit", "inches")
                })
                dimensions.append({
                    "type": "depth",
                    "value": str(dims.get("depth", "")),
                    "unit": dims.get("unit", "inches")
                })
            
            recommendation = ProductRecommendation(
                match_type=match_type,
                category=category,
                name=product.get("name", ""),
                price=product.get("price"),
                currency=product.get("currency", "USD"),
                color=product.get("colors", []),
                image=product.get("imageUrl", ""),
                url=product.get("productUrl", ""),
                match_score=int(score * 100),  # Convert to integer percentage
                dimensions=dimensions
            )
            recommendations.append(recommendation)
        
        return RecommendationResponse(
            recommendations=recommendations,
            total_found=len(recommendations),
            search_keywords=search_terms
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/api/recommend_products/health")
async def health_check():
    """Health check endpoint for the recommendation service"""
    return {
        "status": "healthy",
        "service": "recommendation_engine",
        "version": "1.0.0"
    }

@router.get("/api/recommend_products/test")
async def test_endpoint():
    """Test endpoint with sample data"""
    sample_request = GeminiAnalysisRequest(
        room_type="living room",
        style="Scandinavian Minimalist",
        color_scheme=["white", "oak", "sage green"],
        furniture_identified=["sofa", "coffee table", "bookshelf"],
        improvement_suggestions=["add warm lighting", "introduce natural wood textures"]
    )
    
    return await recommend_products(sample_request)
