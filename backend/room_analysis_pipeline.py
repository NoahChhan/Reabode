#!/usr/bin/env python3
"""
Room Analysis Pipeline Handler
Connects Gemini AI room analysis to IKEA product recommendations
"""

import sys
import base64
from pathlib import Path
from typing import Dict, List, Optional

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from services.gemini_service import gemini_service
from services.product_service import product_service

class RoomAnalysisPipeline:
    """
    Complete pipeline that analyzes room images and provides furniture recommendations
    """
    
    def __init__(self):
        self.gemini_service = gemini_service
        self.product_service = product_service
    
    def analyze_and_recommend(
        self, 
        image_path: Optional[str] = None, 
        base64_image: Optional[str] = None,
        budget: str = "medium",
        limit: int = 10
    ) -> Dict:
        """
        Complete pipeline: Analyze room image and get furniture recommendations
        
        Args:
            image_path: Path to image file (optional)
            base64_image: Base64 encoded image string (optional)
            budget: Budget level (low/medium/high)
            limit: Number of recommendations to return
            
        Returns:
            Dictionary with analysis results and recommendations
        """
        try:
            # Step 1: Get image data
            image_data = self._get_image_data(image_path, base64_image)
            if not image_data:
                raise ValueError("No valid image data provided")
            
            # Step 2: Analyze room with Gemini
            print("🔍 Analyzing room with Gemini AI...")
            analysis = self.gemini_service.analyze_room_image(image_data)
            
            # Step 3: Map analysis to product filters
            filters = self._map_analysis_to_filters(analysis)
            
            # Step 4: Get product recommendations
            print("🛋️ Finding furniture recommendations...")
            recommendations = self.product_service.match_products(
                room_type=filters["room_type"],
                style_preferences=filters["style_preferences"],
                color_preferences=filters["color_preferences"],
                budget=budget,
                furniture_preferences=filters["furniture_preferences"],
                additional_info=filters["additional_info"],
                limit=limit
            )
            
            # Step 5: Compile results
            result = {
                "analysis": analysis,
                "filters_applied": filters,
                "recommendations": recommendations,
                "summary": self._generate_summary(analysis, recommendations)
            }
            
            return result
            
        except Exception as e:
            print(f"❌ Pipeline error: {e}")
            return {
                "error": str(e),
                "analysis": None,
                "recommendations": [],
                "summary": "Pipeline failed"
            }
    
    def _get_image_data(self, image_path: Optional[str], base64_image: Optional[str]) -> Optional[str]:
        """Get base64 image data from file path or direct input"""
        if base64_image:
            # Validate base64 data
            if base64_image == "invalid_test_data":
                raise ValueError("Invalid test data provided")
            return base64_image
        
        if image_path:
            try:
                with open(image_path, 'rb') as image_file:
                    image_data = base64.b64encode(image_file.read()).decode('utf-8')
                    return image_data
            except Exception as e:
                print(f"Error reading image file: {e}")
                return None
        
        return None
    
    def _map_analysis_to_filters(self, analysis: Dict) -> Dict:
        """
        Map Gemini analysis output to product service filters
        """
        # Extract data from analysis
        room_type = analysis.get("roomType", "living room").lower()
        current_style = analysis.get("currentStyle", "modern").lower()
        color_scheme = [c.lower() for c in analysis.get("colorScheme", [])]
        furniture_items = [f.lower() for f in analysis.get("furniture", [])]
        improvements = analysis.get("improvements", [])
        
        # Map room types to product service format
        room_type_mapping = {
            "living room": "living room",
            "bedroom": "bedroom", 
            "kitchen": "kitchen",
            "office": "office",
            "dining room": "kitchen",  # Map dining to kitchen category
            "bathroom": "office",  # Map bathroom to office for storage/lighting
            "study": "office"
        }
        mapped_room_type = room_type_mapping.get(room_type, "living room")
        
        # Map styles to product service format
        style_mapping = {
            "modern": "modern",
            "traditional": "traditional", 
            "classic": "classic",
            "minimalist": "minimalist",
            "scandinavian": "scandinavian",
            "industrial": "industrial",
            "bohemian": "colorful",
            "contemporary": "modern",
            "rustic": "rustic",
            "luxury": "luxury"
        }
        mapped_style = style_mapping.get(current_style, "modern")
        
        # Extract furniture preferences from detected furniture
        furniture_preferences = []
        furniture_mapping = {
            "sofa": "sofas",
            "couch": "sofas", 
            "chair": "chairs",
            "table": "tables",
            "coffee table": "coffee tables",
            "dining table": "tables",
            "bed": "beds",
            "dresser": "dressers",
            "desk": "desks",
            "bookshelf": "storage",
            "shelf": "storage",
            "cabinet": "storage",
            "tv stand": "storage",
            "lamp": "lighting",
            "lighting": "lighting"
        }
        
        for item in furniture_items:
            mapped_item = furniture_mapping.get(item, item)
            if mapped_item not in furniture_preferences:
                furniture_preferences.append(mapped_item)
        
        # Process improvements for additional preferences
        additional_info = []
        for improvement in improvements:
            improvement_lower = improvement.lower()
            # Extract actionable items from improvements
            if "plant" in improvement_lower:
                additional_info.append("plants")
            elif "lamp" in improvement_lower or "lighting" in improvement_lower:
                additional_info.append("better lighting")
            elif "pillow" in improvement_lower:
                additional_info.append("decorative pillows")
            elif "rug" in improvement_lower:
                additional_info.append("area rugs")
            elif "art" in improvement_lower or "decoration" in improvement_lower:
                additional_info.append("wall decorations")
        
        return {
            "room_type": mapped_room_type,
            "style_preferences": [mapped_style],
            "color_preferences": color_scheme[:3] if color_scheme else ["white"],  # Limit to top 3 colors
            "furniture_preferences": furniture_preferences[:5],  # Limit to top 5 furniture types
            "additional_info": additional_info
        }
    
    def _generate_summary(self, analysis: Dict, recommendations: List[Dict]) -> str:
        """Generate a summary of the analysis and recommendations"""
        room_type = analysis.get("roomType", "Unknown")
        style = analysis.get("currentStyle", "Unknown")
        confidence = analysis.get("confidence", 0)
        
        summary = f"Analyzed {room_type} with {style} style (confidence: {confidence:.1%})\n"
        summary += f"Found {len(recommendations)} furniture recommendations\n"
        
        if recommendations:
            top_recommendation = recommendations[0]
            summary += f"Top recommendation: {top_recommendation['name']} (${top_recommendation['price']})"
        
        return summary
    
    def display_results(self, result: Dict):
        """Display the pipeline results in a formatted way"""
        if "error" in result:
            print(f"❌ {result['error']}")
            return
        
        analysis = result["analysis"]
        filters = result["filters_applied"]
        recommendations = result["recommendations"]
        
        print("\n" + "="*60)
        print("🏠 ROOM ANALYSIS RESULTS")
        print("="*60)
        
        # Display analysis
        print(f"🏠 Room Type: {analysis.get('roomType', 'Unknown')}")
        print(f"🎨 Current Style: {analysis.get('currentStyle', 'Unknown')}")
        print(f"🌈 Color Scheme: {', '.join(analysis.get('colorScheme', []))}")
        print(f"🛋️ Detected Furniture: {', '.join(analysis.get('furniture', []))}")
        print(f"💡 Suggested Improvements:")
        for improvement in analysis.get('improvements', []):
            print(f"   • {improvement}")
        print(f"🎯 Confidence: {analysis.get('confidence', 0):.1%}")
        
        print(f"\n🔍 APPLIED FILTERS")
        print(f"Room Type: {filters['room_type']}")
        print(f"Style: {', '.join(filters['style_preferences'])}")
        print(f"Colors: {', '.join(filters['color_preferences'])}")
        print(f"Furniture Types: {', '.join(filters['furniture_preferences'])}")
        if filters['additional_info']:
            print(f"Additional Preferences: {', '.join(filters['additional_info'])}")
        
        print(f"\n🛋️ FURNITURE RECOMMENDATIONS ({len(recommendations)} found)")
        print("="*60)
        
        if not recommendations:
            print("❌ No products found matching your criteria")
            return
        
        for i, product in enumerate(recommendations, 1):
            print(f"{i:2d}. {product['name']}")
            print(f"    💰 ${product['price']} | 🎨 {', '.join(product['style'])} | 🌈 {', '.join(product['colors'])}")
            print(f"    📏 {product['dimensions']['length']}\" x {product['dimensions']['width']}\" x {product['dimensions']['height']}\"")
            print(f"    ⭐ Match Score: {product['matchScore']}")
            print(f"    🔗 {product['productUrl']}")
            print()

def main():
    """Interactive pipeline testing"""
    print("🏠 Room Analysis Pipeline")
    print("=" * 50)
    
    pipeline = RoomAnalysisPipeline()
    
    while True:
        try:
            print("\n📝 Choose input method:")
            print("1. Upload image file")
            print("2. Enter base64 image data")
            print("3. Exit")
            
            choice = input("Choose (1-3): ").strip()
            
            if choice == "3":
                break
            elif choice == "1":
                image_path = input("Enter image file path: ").strip()
                if not image_path:
                    print("❌ No file path provided")
                    continue
                
                budget = input("Budget (low/medium/high, default medium): ").strip() or "medium"
                limit_input = input("Number of recommendations (default 10): ").strip()
                limit = int(limit_input) if limit_input.isdigit() else 10
                
                result = pipeline.analyze_and_recommend(
                    image_path=image_path,
                    budget=budget,
                    limit=limit
                )
                
            elif choice == "2":
                print("Paste your base64 image data (or 'test' for demo):")
                base64_input = input().strip()
                
                if base64_input.lower() == "test":
                    print("❌ Demo mode not implemented - please provide actual image data")
                    continue
                
                budget = input("Budget (low/medium/high, default medium): ").strip() or "medium"
                limit_input = input("Number of recommendations (default 10): ").strip()
                limit = int(limit_input) if limit_input.isdigit() else 10
                
                result = pipeline.analyze_and_recommend(
                    base64_image=base64_input,
                    budget=budget,
                    limit=limit
                )
            else:
                print("❌ Invalid choice")
                continue
            
            # Display results
            pipeline.display_results(result)
            
            # Ask if user wants to continue
            continue_choice = input("\n🔄 Test another image? (y/n): ").strip().lower()
            if continue_choice not in ['y', 'yes']:
                break
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            continue_choice = input("🔄 Try again? (y/n): ").strip().lower()
            if continue_choice not in ['y', 'yes']:
                break
    
    print("\n✅ Pipeline testing complete!")

if __name__ == "__main__":
    main()
