#!/usr/bin/env python3
"""
Test script for the recommendations API endpoint
Tests the /recommendations endpoint with various scenarios
"""

import requests
import json
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

def test_recommendations_endpoint():
    """Test the recommendations endpoint with various scenarios"""
    
    # Base URL for the API
    base_url = "http://localhost:8000"
    
    # Test scenarios
    test_cases = [
        {
            "name": "Modern Living Room - Medium Budget",
            "analysis": {
                "roomType": "living room",
                "currentStyle": "Modern",
                "colorScheme": ["white", "gray"],
                "furniture": ["sofa", "coffee table"],
                "improvements": ["better lighting"],
                "confidence": 0.85
            },
            "budget": "medium",
            "style": ["modern", "scandinavian"]
        },
        {
            "name": "Traditional Bedroom - Low Budget",
            "analysis": {
                "roomType": "bedroom",
                "currentStyle": "Traditional",
                "colorScheme": ["brown", "beige"],
                "furniture": ["bed", "dresser"],
                "improvements": ["storage solutions"],
                "confidence": 0.90
            },
            "budget": "low",
            "style": ["traditional", "classic"]
        },
        {
            "name": "Industrial Office - High Budget",
            "analysis": {
                "roomType": "office",
                "currentStyle": "Industrial",
                "colorScheme": ["black", "gray"],
                "furniture": ["desk", "chair"],
                "improvements": ["better lighting"],
                "confidence": 0.80
            },
            "budget": "high",
            "style": ["industrial", "modern"]
        }
    ]
    
    print("🚀 Testing Recommendations API Endpoint")
    print("=" * 60)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 Test Case {i}: {test_case['name']}")
        print("-" * 40)
        
        try:
            # Make the API request
            response = requests.post(
                f"{base_url}/recommendations",
                json={
                    "analysis": test_case["analysis"],
                    "budget": test_case["budget"],
                    "style": test_case["style"]
                },
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                recommendations = response.json()
                print(f"✅ Success! Found {len(recommendations)} recommendations")
                
                # Display top 3 recommendations
                for j, rec in enumerate(recommendations[:3], 1):
                    print(f"  {j}. {rec['name']} - ${rec['price']}")
                    print(f"     Style: {rec['style']} | Colors: {', '.join(rec['colors'])}")
                    print(f"     Score: {rec['matchScore']} | Category: {rec['category']}")
                    print()
                
                if len(recommendations) > 3:
                    print(f"     ... and {len(recommendations) - 3} more recommendations")
                    
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection Error: Make sure the backend server is running")
            print("   Run: python main.py")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Testing complete!")

def test_health_endpoint():
    """Test if the API is running"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ API is running and healthy")
            return True
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ API is not running. Start it with: python main.py")
        return False

def main():
    """Main function"""
    print("🏠 Reabode Recommendations API Tester")
    print("=" * 60)
    
    # Check if API is running
    if not test_health_endpoint():
        return
    
    print()
    test_recommendations_endpoint()

if __name__ == "__main__":
    main()
