#!/usr/bin/env python3
"""
Test script for the Room Blueprint Generator API
"""
import requests
import json
import os
from PIL import Image
import numpy as np

def create_test_image(filename: str, width: int = 400, height: int = 300):
    """Create a simple test image for testing the API."""
    # Create a simple test image with some geometric shapes
    img = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Add some colored rectangles to simulate room features
    img[50:150, 50:150] = [100, 150, 200]  # Blue rectangle (wall)
    img[200:300, 200:350] = [150, 100, 100]  # Red rectangle (furniture)
    img[100:120, 0:width] = [200, 200, 200]  # Gray line (floor)
    
    # Save the image
    pil_img = Image.fromarray(img)
    pil_img.save(filename)
    print(f"Created test image: {filename}")

def test_blueprint_api():
    """Test the blueprint generation API."""
    base_url = "http://localhost:8000"
    
    # Test health endpoint
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Create test images
    test_images = []
    for i in range(2):
        filename = f"test_room_{i}.jpg"
        create_test_image(filename)
        test_images.append(filename)
    
    # Test blueprint generation
    print("\nTesting blueprint generation...")
    try:
        files = []
        for img_path in test_images:
            files.append(('files', (img_path, open(img_path, 'rb'), 'image/jpeg')))
        
        data = {
            'wallLength': '10',
            'ceilingHeight': '9',
            'unit': 'feet',
            'roomType': 'Living Room',
            'additionalNotes': 'Test room for API validation'
        }
        
        response = requests.post(f"{base_url}/generate-blueprint", files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Blueprint generated successfully!")
            print(f"Processing time: {result['processingTime']:.2f} seconds")
            print(f"Features detected: {result['features']}")
            print(f"Blueprint URL length: {len(result['blueprintUrl'])} characters")
            
            # Save the blueprint image
            blueprint_data = result['blueprintUrl'].split(',')[1]  # Remove data:image/png;base64,
            import base64
            blueprint_bytes = base64.b64decode(blueprint_data)
            with open('generated_blueprint.png', 'wb') as f:
                f.write(blueprint_bytes)
            print("✅ Blueprint saved as 'generated_blueprint.png'")
            
        else:
            print(f"❌ Blueprint generation failed: {response.status_code}")
            print(f"Error: {response.text}")
    
    except Exception as e:
        print(f"❌ Error testing blueprint generation: {e}")
    
    finally:
        # Clean up test images
        for img_path in test_images:
            if os.path.exists(img_path):
                os.unlink(img_path)
        print("\n🧹 Cleaned up test images")

if __name__ == "__main__":
    print("🚀 Testing Room Blueprint Generator API")
    print("=" * 50)
    test_blueprint_api()
    print("\n✅ Test completed!")
