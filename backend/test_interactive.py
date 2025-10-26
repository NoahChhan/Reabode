#!/usr/bin/env python3
"""
Interactive test script for ProductService
Run this to test different scenarios interactively
"""

import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from services.product_service import product_service

def print_header():
    print("🏠 IKEA Product Recommendation Tester")
    print("=" * 50)

def get_user_input():
    """Get user input for testing"""
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

def display_results(recommendations, room_type, style_preferences, color_preferences, budget):
    """Display the recommendation results"""
    print(f"\n🎯 Recommendations for {room_type}")
    print(f"🎨 Style: {', '.join(style_preferences)}")
    print(f"🌈 Colors: {', '.join(color_preferences)}")
    print(f"💰 Budget: {budget}")
    print("=" * 60)
    
    if not recommendations:
        print("❌ No products found matching your criteria")
        return
    
    print(f"📊 Found {len(recommendations)} recommendations:\n")
    
    for i, product in enumerate(recommendations, 1):
        print(f"{i:2d}. {product['name']}")
        print(f"    💰 ${product['price']} | 🎨 {', '.join(product['style'])} | 🌈 {', '.join(product['colors'])}")
        print(f"    📏 {product['dimensions']['length']}\" x {product['dimensions']['width']}\" x {product['dimensions']['height']}\"")
        print(f"    ⭐ Match Score: {product['matchScore']}")
        print(f"    🔗 {product['productUrl']}")
        print()

def main():
    """Main interactive loop"""
    print_header()
    
    while True:
        try:
            # Get user input
            room_type, style_preferences, color_preferences, budget, limit = get_user_input()
            
            # Get recommendations
            print("\n🔍 Searching for recommendations...")
            recommendations = product_service.match_products(
                room_type=room_type,
                style_preferences=style_preferences,
                color_preferences=color_preferences,
                budget=budget,
                limit=limit
            )
            
            # Display results
            display_results(recommendations, room_type, style_preferences, color_preferences, budget)
            
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
