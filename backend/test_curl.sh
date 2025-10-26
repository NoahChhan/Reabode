#!/bin/bash

# Test script for recommendations API using curl
# Make sure the backend server is running: python main.py

echo "🚀 Testing Recommendations API with curl"
echo "========================================"

# Test 1: Modern Living Room
echo "📋 Test 1: Modern Living Room - Medium Budget"
echo "---------------------------------------------"

curl -X POST "http://localhost:8000/recommendations" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq '.[0:3] | .[] | {name: .name, price: .price, style: .style, matchScore: .matchScore}'

echo -e "\n"

# Test 2: Traditional Bedroom
echo "📋 Test 2: Traditional Bedroom - Low Budget"
echo "-------------------------------------------"

curl -X POST "http://localhost:8000/recommendations" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq '.[0:3] | .[] | {name: .name, price: .price, style: .style, matchScore: .matchScore}'

echo -e "\n"

# Test 3: Industrial Office
echo "📋 Test 3: Industrial Office - High Budget"
echo "------------------------------------------"

curl -X POST "http://localhost:8000/recommendations" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq '.[0:3] | .[] | {name: .name, price: .price, style: .style, matchScore: .matchScore}'

echo -e "\n"
echo "✅ Testing complete!"
