"""
Product Matching Utilities
Handles scoring and matching products against Gemini AI analysis data
"""

from typing import Dict, List, Tuple
import re

class ProductMatcher:
    def __init__(self):
        # Style keyword mappings
        self.style_keywords = {
            "scandinavian": ["scandinavian", "nordic", "minimalist", "clean", "simple", "natural", "wood", "oak", "birch"],
            "modern": ["modern", "contemporary", "sleek", "minimalist", "clean", "geometric"],
            "traditional": ["traditional", "classic", "timeless", "elegant", "formal"],
            "industrial": ["industrial", "metal", "steel", "exposed", "raw", "urban"],
            "minimalist": ["minimalist", "minimal", "simple", "clean", "uncluttered", "sparse"],
            "bohemian": ["bohemian", "boho", "eclectic", "colorful", "vibrant", "artistic"],
            "rustic": ["rustic", "country", "farmhouse", "natural", "wood", "distressed"],
            "luxury": ["luxury", "premium", "high-end", "elegant", "sophisticated"]
        }
        
        # Room type to furniture category mappings
        self.room_furniture_mappings = {
            "living room": ["sofa", "coffee_table", "chair", "lighting", "storage", "rug"],
            "bedroom": ["bed", "storage", "lighting", "rug"],
            "kitchen": ["chair", "storage", "lighting"],
            "dining room": ["chair", "storage", "lighting"],
            "office": ["desk", "chair", "storage", "lighting"],
            "bathroom": ["storage", "lighting"]
        }
        
        # Furniture category synonyms
        self.furniture_synonyms = {
            "sofa": ["couch", "settee", "divan"],
            "coffee_table": ["coffee table", "side table", "end table"],
            "chair": ["seat", "stool"],
            "lighting": ["lamp", "light", "fixture"],
            "storage": ["bookcase", "shelf", "cabinet", "dresser", "wardrobe"],
            "rug": ["carpet", "mat"],
            "bed": ["mattress", "bedframe"],
            "desk": ["table", "workstation"]
        }
    
    def calculate_match_score(self, product: Dict, gemini_data: Dict) -> Tuple[int, str]:
        """
        Calculate match score for a product against Gemini analysis data
        Returns (score, match_type)
        """
        score = 0
        match_reasons = []
        
        # Extract data from Gemini analysis
        room_type = gemini_data.get("room_type", "").lower()
        style = gemini_data.get("style", "").lower()
        color_scheme = [color.lower() for color in gemini_data.get("color_scheme", [])]
        furniture_identified = [item.lower() for item in gemini_data.get("furniture_identified", [])]
        
        # 1. Color matching (2 points per match)
        product_colors = [color.lower() for color in product.get("colors", [])]
        for color in color_scheme:
            if any(color in pc or pc in color for pc in product_colors):
                score += 2
                match_reasons.append(f"color_match_{color}")
        
        # 2. Furniture category matching (3 points per match)
        product_name = product.get("name", "").lower()
        product_category = product.get("category", "").lower()
        product_subcategory = product.get("subcategory", "").lower()
        
        for furniture_item in furniture_identified:
            # Direct name match
            if furniture_item in product_name:
                score += 3
                match_reasons.append(f"direct_furniture_{furniture_item}")
            # Category match
            elif furniture_item in product_category or furniture_item in product_subcategory:
                score += 2
                match_reasons.append(f"category_furniture_{furniture_item}")
            # Synonym match
            elif self._check_furniture_synonyms(furniture_item, product_name, product_category):
                score += 2
                match_reasons.append(f"synonym_furniture_{furniture_item}")
        
        # 3. Style matching (2 points per match)
        if style in self.style_keywords:
            style_words = self.style_keywords[style]
            for style_word in style_words:
                if style_word in product_name or style_word in product.get("description", "").lower():
                    score += 2
                    match_reasons.append(f"style_match_{style_word}")
                    break
        
        # 4. Room type relevance (1 point)
        if room_type in self.room_furniture_mappings:
            relevant_categories = self.room_furniture_mappings[room_type]
            if any(cat in product_category or cat in product_subcategory for cat in relevant_categories):
                score += 1
                match_reasons.append(f"room_relevance_{room_type}")
        
        # 5. Price relevance (bonus points for reasonable pricing)
        price = product.get("price")
        if price and isinstance(price, (int, float)):
            if price < 100:  # Budget-friendly
                score += 1
                match_reasons.append("budget_friendly")
            elif 100 <= price <= 500:  # Mid-range
                score += 1
                match_reasons.append("mid_range")
        
        # Determine match type
        if score >= 5:
            match_type = "direct"
        elif score >= 2:
            match_type = "indirect"
        else:
            match_type = "suggested"
        
        return score, match_type
    
    def _check_furniture_synonyms(self, furniture_item: str, product_name: str, product_category: str) -> bool:
        """Check if furniture item matches through synonyms"""
        if furniture_item in self.furniture_synonyms:
            synonyms = self.furniture_synonyms[furniture_item]
            for synonym in synonyms:
                if synonym in product_name or synonym in product_category:
                    return True
        return False
    
    def generate_search_keywords(self, gemini_data: Dict) -> List[str]:
        """
        Generate search keywords from Gemini analysis data
        """
        keywords = []
        
        # Direct furniture items
        furniture_identified = gemini_data.get("furniture_identified", [])
        keywords.extend([item.lower() for item in furniture_identified])
        
        # Style-based keywords
        style = gemini_data.get("style", "").lower()
        if style in self.style_keywords:
            keywords.extend(self.style_keywords[style])
        
        # Color scheme keywords
        color_scheme = gemini_data.get("color_scheme", [])
        keywords.extend([color.lower() for color in color_scheme])
        
        # Room type related keywords
        room_type = gemini_data.get("room_type", "").lower()
        if room_type in self.room_furniture_mappings:
            keywords.extend(self.room_furniture_mappings[room_type])
        
        # Remove duplicates and empty strings
        keywords = list(set([kw for kw in keywords if kw.strip()]))
        
        return keywords
    
    def categorize_product(self, product: Dict) -> str:
        """
        Categorize a product based on its name and category
        """
        product_name = product.get("name", "").lower()
        product_category = product.get("category", "").lower()
        product_subcategory = product.get("subcategory", "").lower()
        
        # Check for specific furniture types
        if any(word in product_name for word in ["sofa", "couch", "settee"]):
            return "sofa"
        elif any(word in product_name for word in ["coffee table", "side table", "end table"]):
            return "coffee_table"
        elif any(word in product_name for word in ["chair", "seat", "stool"]):
            return "chair"
        elif any(word in product_name for word in ["lamp", "light", "fixture"]):
            return "lighting"
        elif any(word in product_name for word in ["bookcase", "shelf", "cabinet", "dresser"]):
            return "storage"
        elif any(word in product_name for word in ["rug", "carpet", "mat"]):
            return "rug"
        elif any(word in product_name for word in ["bed", "mattress", "bedframe"]):
            return "bed"
        elif any(word in product_name for word in ["desk", "table", "workstation"]):
            return "desk"
        else:
            # Fallback to subcategory or category
            return product_subcategory or product_category or "furniture"

# Create a singleton instance
product_matcher = ProductMatcher()
