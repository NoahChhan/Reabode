#!/usr/bin/env python3
"""
Demo script for Room Analysis Pipeline
Shows the complete flow from room analysis to furniture recommendations
"""

import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from room_analysis_pipeline import RoomAnalysisPipeline

def demo_pipeline():
    """Demonstrate the complete pipeline"""
    print("🏠 Room Analysis Pipeline Demo")
    print("=" * 60)
    
    pipeline = RoomAnalysisPipeline()
    
    # Simulate analyzing a room image (using mock data since no API key)
    print("📸 Simulating room image analysis...")
    print("   (In production, this would analyze a real room photo)")
    
    # The pipeline will use mock data from Gemini service
    result = pipeline.analyze_and_recommend(
        base64_image="mock_room_image_data",
        budget="medium",
        limit=8
    )
    
    # Display the complete results
    pipeline.display_results(result)
    
    print("\n" + "="*60)
    print("🎯 PIPELINE SUMMARY")
    print("="*60)
    print("✅ Room Analysis: Gemini AI analyzed the room")
    print("✅ Filter Mapping: Analysis converted to product filters")
    print("✅ Product Matching: IKEA products matched to room needs")
    print("✅ Recommendations: Personalized furniture suggestions")
    
    print(f"\n📊 Results: {len(result['recommendations'])} furniture recommendations")
    print(f"🎨 Room Style: {result['analysis']['currentStyle']}")
    print(f"🏠 Room Type: {result['analysis']['roomType']}")
    
    if result['recommendations']:
        top_rec = result['recommendations'][0]
        print(f"⭐ Top Pick: {top_rec['name']} (${top_rec['price']})")

def show_usage():
    """Show how to use the pipeline"""
    print("\n" + "="*60)
    print("📖 HOW TO USE THE PIPELINE")
    print("="*60)
    print("1. Set GEMINI_API_KEY environment variable")
    print("2. Run: python room_analysis_pipeline.py")
    print("3. Choose input method:")
    print("   - Option 1: Upload image file")
    print("   - Option 2: Paste base64 image data")
    print("4. Set budget preferences (low/medium/high)")
    print("5. Get personalized furniture recommendations!")
    
    print("\n🔧 API Integration:")
    print("   The pipeline can also be used programmatically:")
    print("   ```python")
    print("   pipeline = RoomAnalysisPipeline()")
    print("   result = pipeline.analyze_and_recommend(")
    print("       image_path='room_photo.jpg',")
    print("       budget='medium',")
    print("       limit=10")
    print("   )")
    print("   ```")

if __name__ == "__main__":
    demo_pipeline()
    show_usage()
