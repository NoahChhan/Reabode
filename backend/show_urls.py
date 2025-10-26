#!/usr/bin/env python3
"""
Simple URL Display Script
Shows the URLs from the API response
"""

import requests
import json

def show_urls():
    """Show URLs from the API response"""
    
    print("🔗 IKEA Product URLs from API Response")
    print("=" * 60)
    
    # Sample data
    sample_data = {
        "room_type": "living room",
        "style": "Modern",
        "color_scheme": ["white"],
        "furniture_identified": ["sofa"],
        "improvement_suggestions": ["add lighting"]
    }
    
    try:
        print("📝 Calling recommendation API...")
        response = requests.post(
            "http://localhost:8000/api/recommend_products",
            json=sample_data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"✅ API Response received!")
            print(f"📊 Found {result['total_found']} recommendations")
            
            if result['recommendations']:
                print(f"\n🔗 Product URLs:")
                print("-" * 60)
                
                for i, rec in enumerate(result['recommendations'][:5], 1):
                    print(f"{i}. {rec['name']}")
                    print(f"   💰 ${rec['price']} {rec['currency']}")
                    print(f"   🔗 {rec['url']}")
                    print(f"   🎯 Match: {rec['match_type']} (Score: {rec['match_score']})")
                    print()
                
                print("📋 How to verify these URLs:")
                print("1. Copy any URL above")
                print("2. Paste it into your browser")
                print("3. You should see the actual IKEA product page")
                print("4. The URLs follow IKEA's standard format:")
                print("   https://www.ikea.com/us/en/p/{product_id}/")
                
            else:
                print("⚠️  No recommendations returned")
            
            return True
            
        else:
            print(f"❌ API Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    show_urls()
