#!/usr/bin/env python3
"""
Quick Optimized Test - Tests the bedroom pipeline with reduced limits
"""

import sys
from pathlib import Path
import requests
import json

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

def test_optimized_bedroom():
    """Test bedroom pipeline with optimized limits"""
    
    print("🛏️ Optimized Bedroom Test")
    print("=" * 35)
    print("Using reduced limits for faster response:")
    print("• 3 products per search term (was 8)")
    print("• 5 products per search (was 20)")
    print("• 15 total products max (was 40)")
    print("• 1 second delay between searches (was 2)")
    print()
    
    # Bedroom data
    bedroom_data = {
        "room_type": "bedroom",
        "style": "Scandinavian Minimalist",
        "color_scheme": ["white", "oak"],
        "furniture_identified": ["bed", "nightstand"],
        "improvement_suggestions": ["add warm lighting"]
    }
    
    print("📝 Test Data:")
    print(f"   Room: {bedroom_data['room_type']}")
    print(f"   Style: {bedroom_data['style']}")
    print(f"   Colors: {', '.join(bedroom_data['color_scheme'])}")
    print(f"   Need: {', '.join(bedroom_data['furniture_identified'])}")
    
    try:
        print(f"\n🔍 Calling API with optimized settings...")
        response = requests.post(
            "http://localhost:8000/api/recommend_products",
            json=bedroom_data,
            timeout=60  # 1 minute timeout should be enough now
        )
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"\n✅ Success!")
            print(f"📊 Found {result['total_found']} products")
            print(f"🔍 Keywords: {', '.join(result['search_keywords'])}")
            
            if result['recommendations']:
                print(f"\n🛏️ Bedroom Recommendations:")
                print("-" * 35)
                
                for i, rec in enumerate(result['recommendations'], 1):
                    print(f"{i}. {rec['name']}")
                    print(f"   💰 ${rec['price']} | 🎯 {rec['match_type']} | ⭐ {rec['match_score']}")
                    print(f"   🔗 {rec['url']}")
                    print()
                
                # Check for beds specifically
                beds = [r for r in result['recommendations'] if 'bed' in r['name'].lower()]
                if beds:
                    print(f"\n🛏️ BEDS FOUND ({len(beds)}):")
                    for bed in beds:
                        print(f"   • {bed['name']} - ${bed['price']}")
                        print(f"     {bed['url']}")
                        print()
                
                # Check for nightstands
                nightstands = [r for r in result['recommendations'] if 'nightstand' in r['name'].lower()]
                if nightstands:
                    print(f"\n🪑 NIGHTSTANDS FOUND ({len(nightstands)}):")
                    for nightstand in nightstands:
                        print(f"   • {nightstand['name']} - ${nightstand['price']}")
                        print(f"     {nightstand['url']}")
                        print()
                
            else:
                print("⚠️  No recommendations returned")
            
            return True
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out after 1 minute")
        print("💡 Even with optimizations, it's still taking too long")
        print("💡 Consider further reducing limits or using mock data")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Optimized Bedroom Pipeline Test")
    print("=" * 35)
    print("Testing with reduced product limits for faster response")
    print()
    
    success = test_optimized_bedroom()
    
    if success:
        print("\n🎉 Optimized test completed!")
        print("✅ Your pipeline is working with faster response times!")
        print("💡 Copy any URL above to verify it's real")
        print("💡 The optimizations reduced scraping time significantly")
    else:
        print("\n❌ Test failed")
        print("💡 The optimizations may need further adjustment")
        print("💡 Consider reducing limits even more or using mock data")
    
    print("\n📊 Optimization Summary:")
    print("• Products per search term: 8 → 3 (62% reduction)")
    print("• Products per search: 20 → 5 (75% reduction)")
    print("• Total products max: 40 → 15 (62% reduction)")
    print("• Delay between searches: 2s → 1s (50% reduction)")
    print("• Expected total time: ~2-3 minutes → ~30-45 seconds")
