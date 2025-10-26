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

from services.ikea_scraper import ikea_scraper_service
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
        
        # Generate search terms from Gemini analysis
        search_terms = ikea_scraper_service.generate_search_terms(gemini_data)
        
        if not search_terms:
            return RecommendationResponse(
                recommendations=[],
                total_found=0,
                search_keywords=[]
            )
        
        # Search and fetch real IKEA products (minimal for fast response)
        products = ikea_scraper_service.search_and_fetch_products(search_terms, limit_per_term=1)
        
        if not products:
            return RecommendationResponse(
                recommendations=[],
                total_found=0,
                search_keywords=search_terms
            )
        
        # Score and rank products
        scored_products = []
        for product in products:
            score, match_type = product_matcher.calculate_match_score(product, gemini_data)
            if score > 0:  # Only include products with some match
                scored_products.append({
                    "product": product,
                    "score": score,
                    "match_type": match_type
                })
        
        # Sort by score (highest first)
        scored_products.sort(key=lambda x: x["score"], reverse=True)
        
        # Take top 15 recommendations
        top_products = scored_products[:15]
        
        # Format recommendations
        recommendations = []
        for item in top_products:
            product = item["product"]
            match_type = item["match_type"]
            score = item["score"]
            
            # Categorize the product
            category = product_matcher.categorize_product(product)
            
            # Format dimensions
            dimensions = []
            if product.get("dimensions"):
                for dim in product["dimensions"]:
                    dimensions.append({
                        "type": dim.get("type", ""),
                        "value": dim.get("value", ""),
                        "unit": dim.get("unit", "")
                    })
            
            recommendation = ProductRecommendation(
                match_type=match_type,
                category=category,
                name=product.get("name", ""),
                price=product.get("price"),
                currency=product.get("currency", "USD"),
                color=product.get("colors", []),
                image=product.get("image", ""),
                url=product.get("url", ""),
                match_score=score,
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
