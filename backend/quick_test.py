#!/usr/bin/env python3
"""
Quick test script for ProductService
Usage: python quick_test.py [room_type] [style] [color] [budget]
"""

import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from services.product_service import product_service

def quick_test(room_type="living room", style="modern", color="white", budget="medium"):
    """Quick test with command line arguments"""
    print(f"🏠 Testing: {room_type} | {style} | {color} | {budget}")
    print("=" * 50)
    
    recommendations = product_service.match_products(
        room_type=room_type,
        style_preferences=[style],
        color_preferences=[color],
        budget=budget,
        limit=5
    )
    
    print(f"📊 Found {len(recommendations)} recommendations:\n")
    
    for i, product in enumerate(recommendations, 1):
        print(f"{i}. {product['name']} - ${product['price']}")
        print(f"   Style: {', '.join(product['style'])} | Colors: {', '.join(product['colors'])}")
        print(f"   Score: {product['matchScore']} | Category: {product['subcategory']}")
        print()

def main():
    """Main function with command line argument parsing"""
    if len(sys.argv) == 1:
        # No arguments, run default test
        quick_test()
    elif len(sys.argv) == 5:
        # All arguments provided
        room_type, style, color, budget = sys.argv[1:5]
        quick_test(room_type, style, color, budget)
    else:
        print("Usage: python quick_test.py [room_type] [style] [color] [budget]")
        print("Example: python quick_test.py bedroom traditional brown medium")
        print("\nAvailable options:")
        print("Room types: living room, bedroom, kitchen, office")
        print("Styles: modern, classic, traditional, scandinavian, minimalist, industrial")
        print("Colors: white, black, brown, gray, blue, green, yellow, red, beige")
        print("Budgets: low, medium, high")

if __name__ == "__main__":
    main()
