#!/usr/bin/env python3
"""
Test script for ProductService
Run this to test the product matching functionality
"""

import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from services.product_service import product_service

def test_product_loading():
    """Test if products are loaded correctly"""
    print("🔍 Testing product loading...")
    print(f"✅ Loaded {len(product_service.products)} products")
    
    if product_service.products:
        sample_product = product_service.products[0]
        print(f"📦 Sample product: {sample_product['name']} - ${sample_product['price']}")
        print(f"🏷️  Category: {sample_product['category']} > {sample_product['subcategory']}")
        print(f"🎨 Style: {', '.join(sample_product['style'])}")
        print(f"🌈 Colors: {', '.join(sample_product['colors'])}")
    print()

def test_budget_filtering():
    """Test budget filtering"""
    print("💰 Testing budget filtering...")
    
    # Test low budget
    low_budget = product_service.match_products(
        room_type="living room",
        style_preferences=["modern"],
        color_preferences=["white"],
        budget="low",
        limit=5
    )
    print(f"💵 Low budget (0-200): {len(low_budget)} products")
    for product in low_budget[:3]:
        print(f"   - {product['name']}: ${product['price']} (Score: {product['matchScore']})")
    
    # Test high budget
    high_budget = product_service.match_products(
        room_type="living room",
        style_preferences=["modern"],
        color_preferences=["white"],
        budget="high",
        limit=5
    )
    print(f"💎 High budget (800+): {len(high_budget)} products")
    for product in high_budget[:3]:
        print(f"   - {product['name']}: ${product['price']} (Score: {product['matchScore']})")
    print()

def test_room_type_matching():
    """Test room type matching"""
    print("🏠 Testing room type matching...")
    
    # Test living room
    living_room = product_service.match_products(
        room_type="living room",
        style_preferences=["modern"],
        color_preferences=["white"],
        budget="medium",
        limit=5
    )
    print(f"🛋️  Living room recommendations: {len(living_room)} products")
    for product in living_room[:3]:
        print(f"   - {product['name']} ({product['subcategory']}): Score {product['matchScore']}")
    
    # Test bedroom
    bedroom = product_service.match_products(
        room_type="bedroom",
        style_preferences=["modern"],
        color_preferences=["white"],
        budget="medium",
        limit=5
    )
    print(f"🛏️  Bedroom recommendations: {len(bedroom)} products")
    for product in bedroom[:3]:
        print(f"   - {product['name']} ({product['subcategory']}): Score {product['matchScore']}")
    print()

def test_style_matching():
    """Test style preference matching"""
    print("🎨 Testing style matching...")
    
    # Test modern style
    modern = product_service.match_products(
        room_type="living room",
        style_preferences=["modern"],
        color_preferences=["white"],
        budget="medium",
        limit=5
    )
    print(f"✨ Modern style: {len(modern)} products")
    for product in modern[:3]:
        print(f"   - {product['name']}: {', '.join(product['style'])} (Score: {product['matchScore']})")
    
    # Test traditional style
    traditional = product_service.match_products(
        room_type="living room",
        style_preferences=["traditional"],
        color_preferences=["brown"],
        budget="medium",
        limit=5
    )
    print(f"🏛️  Traditional style: {len(traditional)} products")
    for product in traditional[:3]:
        print(f"   - {product['name']}: {', '.join(product['style'])} (Score: {product['matchScore']})")
    print()

def test_color_matching():
    """Test color preference matching"""
    print("🌈 Testing color matching...")
    
    # Test white color
    white = product_service.match_products(
        room_type="living room",
        style_preferences=["modern"],
        color_preferences=["white"],
        budget="medium",
        limit=5
    )
    print(f"⚪ White color: {len(white)} products")
    for product in white[:3]:
        print(f"   - {product['name']}: {', '.join(product['colors'])} (Score: {product['matchScore']})")
    
    # Test brown color
    brown = product_service.match_products(
        room_type="living room",
        style_preferences=["traditional"],
        color_preferences=["brown"],
        budget="medium",
        limit=5
    )
    print(f"🟤 Brown color: {len(brown)} products")
    for product in brown[:3]:
        print(f"   - {product['name']}: {', '.join(product['colors'])} (Score: {product['matchScore']})")
    print()

def test_comprehensive_matching():
    """Test comprehensive matching with all criteria"""
    print("🎯 Testing comprehensive matching...")
    
    # Test a realistic scenario
    recommendations = product_service.match_products(
        room_type="living room",
        style_preferences=["modern", "scandinavian"],
        color_preferences=["white", "gray"],
        budget="medium",
        limit=10
    )
    
    print(f"🏠 Living room, modern/scandinavian, white/gray, medium budget:")
    print(f"📊 Found {len(recommendations)} recommendations")
    print()
    
    for i, product in enumerate(recommendations, 1):
        print(f"{i:2d}. {product['name']}")
        print(f"    💰 ${product['price']} | 🎨 {', '.join(product['style'])} | 🌈 {', '.join(product['colors'])}")
        print(f"    📏 {product['dimensions']['length']}\" x {product['dimensions']['width']}\" x {product['dimensions']['height']}\"")
        print(f"    ⭐ Match Score: {product['matchScore']}")
        print()

def main():
    """Run all tests"""
    print("🚀 Testing ProductService...")
    print("=" * 50)
    
    try:
        test_product_loading()
        test_budget_filtering()
        test_room_type_matching()
        test_style_matching()
        test_color_matching()
        test_comprehensive_matching()
        
        print("✅ All tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
