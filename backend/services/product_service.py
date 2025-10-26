import json
from typing import List, Dict
from pathlib import Path

class ProductService:
    def __init__(self):
        self.products = self._load_products()
    
    def _load_products(self) -> List[Dict]:
        """Load products from JSON file"""
        json_path = Path(__file__).parent.parent / "data" / "ikea_products.json"
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
                return data.get('products', [])
        except Exception as e:
            print(f"Error loading products: {e}")
            return []
    
    def match_products(
        self,
        room_type: str,
        style_preferences: List[str],
        color_preferences: List[str],
        budget: str,
        limit: int = 10
    ) -> List[Dict]:
        """
        Match products based on room analysis and user preferences
        """
        # Filter by budget first
        budget_ranges = {
            "low": (0, 200),
            "medium": (200, 800),
            "high": (800, 10000)
        }
        min_price, max_price = budget_ranges.get(budget, (0, 10000))
        
        filtered = [
            p for p in self.products 
            if min_price <= p['price'] <= max_price
        ]
        
        # Calculate match scores
        scored_products = []
        for product in filtered:
            score = 0.0
            
            # Style matching (40% weight)
            product_styles = [s.lower() for s in product.get('style', [])]
            user_styles = [s.lower() for s in style_preferences]
            style_matches = sum(1 for s in user_styles if s in product_styles)
            if style_matches > 0:
                score += 0.4
            
            # Color matching (30% weight)
            product_colors = [c.lower() for c in product.get('colors', [])]
            user_colors = [c.lower() for c in color_preferences]
            color_matches = sum(1 for c in user_colors if c in product_colors)
            if color_matches > 0:
                score += 0.3
            
            # Category relevance (30% weight)
            # Living rooms need sofas, chairs, tables
            # Bedrooms need beds, dressers, lighting
            category = product.get('category', '').lower()
            subcategory = product.get('subcategory', '').lower()
            
            room_categories = {
                "living room": ["sofas", "chairs", "coffee tables", "lighting", "storage"],
                "bedroom": ["beds", "dressers", "lighting", "storage"],
                "kitchen": ["tables", "chairs", "storage"],
                "office": ["desks", "chairs", "storage", "lighting"]
            }
            
            relevant_categories = room_categories.get(room_type.lower(), [])
            if any(cat in subcategory or cat in category for cat in relevant_categories):
                score += 0.3
            
            scored_products.append({
                **product,
                'matchScore': round(score, 2)
            })
        
        # Sort by match score and return top results
        scored_products.sort(key=lambda x: x['matchScore'], reverse=True)
        return scored_products[:limit]

# Create a global instance
product_service = ProductService()
