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
        furniture_preferences: List[str] = None,
        additional_info: List[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Match products based on room analysis, style, color, furniture type, and additional preferences.
        """
        furniture_preferences = furniture_preferences or []
        additional_info = additional_info or []

        budget_ranges = {
            "low": (0, 200),
            "medium": (200, 800),
            "high": (800, 10000)
        }
        min_price, max_price = budget_ranges.get(budget, (0, 10000))

        # Filter by price first
        filtered = [
            p for p in self.products
            if min_price <= p['price'] <= max_price
        ]

        scored_products = []
        for product in filtered:
            score = 0.0

            # --- STYLE (30%) ---
            product_styles = [s.lower() for s in product.get('style', [])]
            style_matches = sum(1 for s in style_preferences if s.lower() in product_styles)
            if style_matches > 0:
                score += 0.3

            # --- COLOR (20%) ---
            product_colors = [c.lower() for c in product.get('colors', [])]
            color_matches = sum(1 for c in color_preferences if c.lower() in product_colors)
            if color_matches > 0:
                score += 0.2

            # --- ROOM TYPE RELEVANCE (20%) ---
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
                score += 0.2

            # --- FURNITURE PREFERENCES (20%) ---
            if furniture_preferences:
                furniture_matches = sum(
                    1 for f in furniture_preferences
                    if f.lower() in subcategory or f.lower() in category
                )
                if furniture_matches > 0:
                    score += 0.2

            # --- ADDITIONAL INFO / EXCLUSIONS (10%) ---
            penalty = 0.0
            for info in additional_info:
                info_lower = info.lower()
                # Penalize products that conflict with "no X" or "avoid X"
                if "no" in info_lower or "avoid" in info_lower:
                    banned = info_lower.replace("no", "").replace("avoid", "").strip()
                    if banned in product['name'].lower() or banned in product.get('description', '').lower():
                        penalty += 0.1
                # Reward specific positive keywords (e.g., "want plants")
                elif "plant" in info_lower and "plant" in subcategory:
                    score += 0.1
                elif "lamp" in info_lower and "lighting" in category:
                    score += 0.1

            score -= penalty
            score = max(score, 0.0)  # no negatives

            scored_products.append({
                **product,
                'matchScore': round(score, 2)
            })

        scored_products.sort(key=lambda x: x['matchScore'], reverse=True)
        return scored_products[:limit]

# Create a global instance
product_service = ProductService()
