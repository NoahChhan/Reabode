import google.generativeai as genai
import os
from typing import Dict, List
import json
import base64

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY environment variable not set. Gemini service will return mock data.")
            self.model = None
            return
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    def analyze_room_image(self, base64_image: str) -> Dict:
        """
        Analyze a room image and return structured data using Gemini AI
        """
        try:
            # If no API key, return mock data for testing
            if self.model is None:
                print("Using mock data (no Gemini API key)")
                return {
                    "roomType": "Living Room",
                    "currentStyle": "Modern",
                    "colorScheme": ["white", "gray", "blue"],
                    "furniture": ["sofa", "coffee table", "tv stand"],
                    "improvements": [
                        "Add plants for warmth",
                        "Better lighting with floor lamps",
                        "Colorful throw pillows",
                        "Wall art or decorations",
                        "Area rug to define space"
                    ],
                    "confidence": 0.75
                }
            
            # Remove data:image/jpeg;base64, prefix if present
            if "base64," in base64_image:
                base64_image = base64_image.split("base64,")[1]
            
            # Create the prompt for structured analysis
            prompt = """Analyze this interior space and return a JSON response with:
            1. roomType: The type of room (living room, bedroom, kitchen, bathroom, office, dining room, etc.)
            2. currentStyle: The current design style (modern, traditional, minimalist, bohemian, industrial, scandinavian, etc.)
            3. colorScheme: Array of main colors present (e.g., ["white", "gray", "blue"])
            4. furniture: Array of furniture items visible (e.g., ["sofa", "coffee table", "tv stand"])
            5. improvements: Array of 3-5 suggested improvements for the space
            6. confidence: Your confidence level as a decimal (0.0 to 1.0)

            Return ONLY valid JSON, no other text. Example format:
            {
            "roomType": "Living Room",
            "currentStyle": "Modern",
            "colorScheme": ["white", "gray", "blue"],
            "furniture": ["sofa", "coffee table", "tv stand"],
            "improvements": [
                "Add plants for warmth",
                "Better lighting with floor lamps",
                "Colorful throw pillows",
                "Wall art or decorations",
                "Area rug to define space"
            ],
            "confidence": 0.75
            }"""

            # Generate content with image and prompt
            response = self.model.generate_content([
                prompt,
                {
                    "mime_type": "image/jpeg",
                    "data": base64_image
                }
            ])
            
            # Parse Gemini's response
            response_text = response.text.strip()
            
            # Try to extract JSON from response (sometimes Gemini adds extra text)
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            analysis = json.loads(response_text)
            
            return analysis
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            # Return as fallback
            return {
                "roomType": "",
                "currentStyle": "",
                "colorScheme": [],
                "furniture": [],
                "improvements": [],
                "confidence": 0
            }

# Create a singleton instance
gemini_service = GeminiService()
