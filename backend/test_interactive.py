#!/usr/bin/env python3
"""
Interactive test script for Room Analysis Pipeline
Run this to test the complete pipeline from room analysis to furniture recommendations
"""

import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from room_analysis_pipeline import RoomAnalysisPipeline
from services.product_service import product_service

def print_header():
    print("🏠 Room Analysis Pipeline Tester")
    print("=" * 50)
    print("Test the complete flow: Room Image → Gemini Analysis → Furniture Recommendations")

def get_test_mode():
    """Get user's choice of test mode"""
    print("\n📝 Choose test mode:")
    print("1. Room Analysis Pipeline (Image → Analysis → Recommendations)")
    print("2. Direct Product Service Testing (Manual filters)")
    print("3. Exit")
    
    choice = input("Choose (1-3): ").strip()
    return choice

def get_pipeline_input():
    """Get input for pipeline testing"""
    print("\n📸 Room Analysis Pipeline Input:")
    print("1. Upload image file")
    print("2. Use mock data (demo)")
    print("3. Back to main menu")
    
    choice = input("Choose (1-3): ").strip()
    
    if choice == "1":
        image_path = input("Enter image file path: ").strip()
        if not image_path:
            print("❌ No file path provided")
            return None, None, None, None
        
        budget = input("Budget (low/medium/high, default medium): ").strip() or "medium"
        limit_input = input("Number of recommendations (default 10): ").strip()
        limit = int(limit_input) if limit_input.isdigit() else 10
        
        return "file", image_path, budget, limit
    
    elif choice == "2":
        budget = input("Budget (low/medium/high, default medium): ").strip() or "medium"
        limit_input = input("Number of recommendations (default 10): ").strip()
        limit = int(limit_input) if limit_input.isdigit() else 10
        
        return "mock", None, budget, limit
    
    elif choice == "3":
        return "back", None, None, None
    
    else:
        print("❌ Invalid choice")
        return None, None, None, None

def get_manual_input():
    """Get user input for manual product service testing"""
    print("\n📝 Enter your preferences:")
    
    # Room type
    print("\n🏠 Room type:")
    print("1. living room")
    print("2. bedroom") 
    print("3. kitchen")
    print("4. office")
    room_choice = input("Choose (1-4): ").strip()
    room_types = {"1": "living room", "2": "bedroom", "3": "kitchen", "4": "office"}
    room_type = room_types.get(room_choice, "living room")
    
    # Style preferences
    print("\n🎨 Style preferences (comma-separated):")
    print("Available: modern, classic, traditional, scandinavian, minimalist, industrial, luxury, functional, rustic, natural, colorful, ergonomic, modular, upholstered")
    style_input = input("Enter styles: ").strip()
    style_preferences = [s.strip().lower() for s in style_input.split(",") if s.strip()]
    if not style_preferences:
        style_preferences = ["modern"]
    
    # Color preferences
    print("\n🌈 Color preferences (comma-separated):")
    print("Available: white, black, brown, gray, blue, green, yellow, red, beige")
    color_input = input("Enter colors: ").strip()
    color_preferences = [c.strip().lower() for c in color_input.split(",") if c.strip()]
    if not color_preferences:
        color_preferences = ["white"]
    
    # Budget
    print("\n💰 Budget:")
    print("1. low (0-200)")
    print("2. medium (200-800)")
    print("3. high (800+)")
    budget_choice = input("Choose (1-3): ").strip()
    budget_options = {"1": "low", "2": "medium", "3": "high"}
    budget = budget_options.get(budget_choice, "medium")
    
    # Limit
    limit_input = input("\n📊 Number of recommendations (default 10): ").strip()
    try:
        limit = int(limit_input) if limit_input else 10
    except ValueError:
        limit = 10
    
    return room_type, style_preferences, color_preferences, budget, limit

def main():
    """Main interactive loop"""
    print_header()
    
    pipeline = RoomAnalysisPipeline()
    
    while True:
        try:
            # Get test mode choice
            mode = get_test_mode()
            
            if mode == "3":
                break
            elif mode == "1":
                # Room Analysis Pipeline testing
                input_type, image_path, budget, limit = get_pipeline_input()
                
                if input_type == "back":
                    continue
                elif input_type is None:
                    continue
                
                print("\n🔍 Running room analysis pipeline...")
                
                if input_type == "file":
                    result = pipeline.analyze_and_recommend(
                        image_path=image_path,
                        budget=budget,
                        limit=limit
                    )
                else:  # mock
                    result = pipeline.analyze_and_recommend(
                        base64_image="mock_data",
                        budget=budget,
                        limit=limit
                    )
                
                # Display results
                pipeline.display_results(result)
                
            elif mode == "2":
                # Manual product service testing
                room_type, style_preferences, color_preferences, budget, limit = get_manual_input()
                
                print("\n🔍 Searching for recommendations...")
                recommendations = product_service.match_products(
                    room_type=room_type,
                    style_preferences=style_preferences,
                    color_preferences=color_preferences,
                    budget=budget,
                    limit=limit
                )
                
                # Display results (simplified version)
                print(f"\n🎯 Recommendations for {room_type}")
                print(f"🎨 Style: {', '.join(style_preferences)}")
                print(f"🌈 Colors: {', '.join(color_preferences)}")
                print(f"💰 Budget: {budget}")
                print("=" * 60)
                
                if not recommendations:
                    print("❌ No products found matching your criteria")
                else:
                    print(f"📊 Found {len(recommendations)} recommendations:\n")
                    
                    for i, product in enumerate(recommendations, 1):
                        print(f"{i:2d}. {product['name']}")
                        print(f"    💰 ${product['price']} | 🎨 {', '.join(product['style'])} | 🌈 {', '.join(product['colors'])}")
                        print(f"    📏 {product['dimensions']['length']}\" x {product['dimensions']['width']}\" x {product['dimensions']['height']}\"")
                        print(f"    ⭐ Match Score: {product['matchScore']}")
                        print(f"    🔗 {product['productUrl']}")
                        print()
            else:
                print("❌ Invalid choice")
                continue
            
            # Ask if user wants to continue
            continue_choice = input("🔄 Test another scenario? (y/n): ").strip().lower()
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
    
    print("\n✅ Testing complete!")

if __name__ == "__main__":
    main()
