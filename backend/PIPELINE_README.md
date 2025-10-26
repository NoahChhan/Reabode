# Room Analysis Pipeline

A complete pipeline that connects Gemini AI room analysis to IKEA furniture recommendations.

## Overview

The pipeline takes a room image, analyzes it with Gemini AI, and automatically generates personalized furniture recommendations from IKEA's product catalog.

## Flow

```
Room Image → Gemini Analysis → Filter Mapping → Product Matching → Recommendations
```

## Files

- **`room_analysis_pipeline.py`** - Main pipeline handler
- **`test_interactive.py`** - Interactive testing interface (updated)
- **`demo_pipeline.py`** - Simple demo script
- **`test_pipeline.py`** - Unit tests for the pipeline

## Usage

### Interactive Testing

```bash
python test_interactive.py
```

Choose from:

1. **Room Analysis Pipeline** - Complete flow with image analysis
2. **Direct Product Service** - Manual filter testing

### Demo Mode

```bash
python demo_pipeline.py
```

### Programmatic Usage

```python
from room_analysis_pipeline import RoomAnalysisPipeline

pipeline = RoomAnalysisPipeline()
result = pipeline.analyze_and_recommend(
    image_path='room_photo.jpg',
    budget='medium',
    limit=10
)
```

## Features

### Gemini Analysis Output

- Room type detection
- Style classification
- Color scheme extraction
- Furniture identification
- Improvement suggestions
- Confidence scoring

### Filter Mapping

- Maps analysis to product service filters
- Handles different room types and styles
- Extracts furniture preferences
- Processes improvement suggestions

### Product Recommendations

- Matches IKEA products to room needs
- Scores products based on multiple criteria
- Supports budget filtering
- Returns detailed product information

## Configuration

Set the `GEMINI_API_KEY` environment variable for real AI analysis:

```bash
export GEMINI_API_KEY="your_api_key_here"
```

Without the API key, the service uses mock data for testing.

## Example Output

```
🏠 Room Type: Living Room
🎨 Current Style: Modern
🌈 Color Scheme: white, gray, blue
🛋️ Detected Furniture: sofa, coffee table, tv stand
💡 Suggested Improvements:
   • Add plants for warmth
   • Better lighting with floor lamps
   • Colorful throw pillows
   • Wall art or decorations
   • Area rug to define space
🎯 Confidence: 75.0%

🛋️ FURNITURE RECOMMENDATIONS (8 found)
 1. KIVIK 3-seat sofa - $699.0 (Score: 0.9)
 2. SÖDERHAMN 3-seat sofa - $799.0 (Score: 0.9)
 3. VIMLE 3-seat sofa - $449.0 (Score: 0.9)
 ...
```

## Integration

The pipeline integrates with:

- **Gemini Service** - AI-powered room analysis
- **Product Service** - IKEA product matching
- **Main API** - FastAPI endpoints for web/mobile apps
