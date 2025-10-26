# 🧪 Room Analysis Pipeline Testing Guide

## Overview

This guide shows you how to test the complete Room Analysis Pipeline that connects Gemini AI room analysis to IKEA furniture recommendations.

## 🚀 Quick Start

### 1. Run the Pipeline Demo

```bash
cd backend
python demo_pipeline.py
```

This runs a complete demonstration of the pipeline flow with mock data.

### 2. Interactive Testing

```bash
python test_interactive.py
```

This opens an interactive menu where you can:

- Test the complete pipeline with real images
- Test manual product service filtering
- Compare different scenarios

## 🔄 Pipeline Flow

The complete pipeline follows this flow:

```
Room Image → Gemini Analysis → Filter Mapping → Product Matching → Recommendations
```

### Step 1: Room Image Analysis

- **Input**: Room photo (file path or base64 data)
- **Process**: Gemini AI analyzes the image
- **Output**: Room type, style, colors, furniture, improvements, confidence

### Step 2: Filter Mapping

- **Input**: Gemini analysis results
- **Process**: Maps analysis to product service filters
- **Output**: Room type, style preferences, color preferences, furniture preferences, additional info

### Step 3: Product Matching

- **Input**: Mapped filters + budget preferences
- **Process**: IKEA product matching algorithm
- **Output**: Ranked furniture recommendations with match scores

## 📊 Test Scenarios

### Pipeline Testing

#### Room Analysis Scenarios

- **Modern Living Room**: White/gray colors, sofas, coffee tables
- **Scandinavian Bedroom**: White/beige colors, beds, dressers
- **Industrial Office**: Black/gray colors, desks, chairs
- **Traditional Kitchen**: Brown/wood colors, tables, storage

#### Budget Testing

- **Low Budget (0-200)**: Tests affordable products
- **Medium Budget (200-800)**: Tests mid-range products
- **High Budget (800+)**: Tests premium products

### Manual Testing

#### Room Type Testing

- **Living Room**: Sofas, chairs, coffee tables, lighting, storage
- **Bedroom**: Beds, dressers, lighting, storage
- **Kitchen**: Tables, chairs, storage
- **Office**: Desks, chairs, storage, lighting

#### Style Testing

- **Modern**: Clean lines, contemporary design
- **Traditional**: Classic, timeless design
- **Scandinavian**: Nordic-inspired, minimalist
- **Industrial**: Metal, exposed elements
- **Minimalist**: Simple, uncluttered

#### Color Testing

- **White**: Clean, bright spaces
- **Black**: Bold, dramatic spaces
- **Brown**: Warm, natural spaces
- **Gray**: Neutral, sophisticated spaces
- **Blue**: Calm, serene spaces

## 🎯 Expected Results

### Pipeline Results

#### High Confidence Analysis (0.8-1.0)

- Clear room type identification
- Accurate style classification
- Comprehensive furniture detection
- Relevant improvement suggestions

#### Medium Confidence Analysis (0.5-0.7)

- Good room type identification
- Reasonable style classification
- Some furniture detection
- Basic improvement suggestions

#### Low Confidence Analysis (0.1-0.4)

- Uncertain room type
- Vague style classification
- Limited furniture detection
- Generic improvement suggestions

### Product Recommendations

#### High Match Scores (0.8-1.0)

Products that match multiple criteria:

- Correct room type category
- Matching style preferences
- Matching color preferences
- Within budget range
- Relevant furniture type

#### Medium Match Scores (0.4-0.7)

Products that match some criteria:

- Correct room type category
- Partial style/color match
- Within budget range

#### Low Match Scores (0.1-0.3)

Products that match few criteria:

- Wrong room type category
- No style/color match
- Within budget range

## 🔍 Understanding the Algorithm

### Gemini Analysis Algorithm

1. **Room Type Detection**: Identifies room type from visual cues
2. **Style Classification**: Determines design style from furniture and decor
3. **Color Extraction**: Identifies dominant colors in the space
4. **Furniture Detection**: Lists visible furniture items
5. **Improvement Suggestions**: Provides enhancement recommendations
6. **Confidence Scoring**: Rates analysis certainty

### Filter Mapping Algorithm

1. **Room Type Mapping**: Maps analysis to product categories
2. **Style Translation**: Converts analysis styles to product styles
3. **Color Processing**: Extracts and limits color preferences
4. **Furniture Mapping**: Converts detected items to product categories
5. **Improvement Processing**: Extracts actionable preferences

### Product Matching Algorithm

The matching algorithm uses weighted scoring:

1. **Style Matching (30% weight)**

   - Compares mapped style preferences with product styles
   - Awards points for exact matches

2. **Color Matching (20% weight)**

   - Compares extracted colors with product colors
   - Awards points for exact matches

3. **Room Type Relevance (20% weight)**

   - Matches room type with relevant product categories
   - Living rooms: sofas, chairs, coffee tables, lighting, storage
   - Bedrooms: beds, dressers, lighting, storage
   - Kitchens: tables, chairs, storage
   - Offices: desks, chairs, storage, lighting

4. **Furniture Preferences (20% weight)**

   - Matches detected furniture types with product categories
   - Awards points for relevant furniture types

5. **Additional Preferences (10% weight)**
   - Processes improvement suggestions
   - Awards points for specific enhancements

## 🛠️ Troubleshooting

### Pipeline Issues

#### No Gemini API Key

- **Symptom**: "Warning: GEMINI_API_KEY environment variable not set"
- **Solution**: Set `export GEMINI_API_KEY="your_api_key_here"`
- **Workaround**: Pipeline uses mock data for testing

#### Image Loading Errors

- **Symptom**: "Error reading image file"
- **Solution**: Check file path and permissions
- **Alternative**: Use base64 image data

#### Analysis Failures

- **Symptom**: Empty analysis results
- **Solution**: Check image quality and format
- **Fallback**: Pipeline returns default values

### Product Matching Issues

#### No Products Found

- **Check**: Budget range restrictions
- **Verify**: Style/color preferences validity
- **Try**: Broader search criteria

#### Low Match Scores

- **Normal**: Products that don't match all criteria
- **Focus**: Products with scores above 0.5
- **Adjust**: Preferences for better matches

### Import Errors

- **Ensure**: Running from backend directory
- **Check**: ikea_products.json file exists
- **Verify**: Python path includes backend directory

## 📈 Performance Notes

- **Gemini Analysis**: ~2-5 seconds per image
- **Filter Mapping**: ~1ms
- **Product Loading**: ~50 products loaded in <1ms
- **Matching Algorithm**: ~10ms for 50 products
- **Memory Usage**: ~1MB for product data
- **Scalability**: Can handle 1000+ products efficiently

## 🎨 Example Test Cases

### Case 1: Modern Living Room Pipeline

```bash
python test_interactive.py
# Choose: 1 (Pipeline) → 2 (Mock data) → medium budget
```

**Expected**: Modern sofas, coffee tables, lighting with white/gray colors

### Case 2: Scandinavian Bedroom Pipeline

```bash
python test_interactive.py
# Choose: 1 (Pipeline) → 2 (Mock data) → low budget
```

**Expected**: Scandinavian beds, dressers, storage with white/beige colors

### Case 3: Industrial Office Manual

```bash
python test_interactive.py
# Choose: 2 (Manual) → office → industrial → black → high
```

**Expected**: Industrial desks, chairs, lighting with black colors

## 🔧 Customization

### Pipeline Customization

To modify the pipeline, edit these files:

- **`room_analysis_pipeline.py`**: Main pipeline logic
- **`services/gemini_service.py`**: Gemini analysis prompts
- **`services/product_service.py`**: Product matching algorithm

### Algorithm Modifications

- **Adjust weights**: Change percentage values in product matching
- **Add criteria**: Extend matching logic
- **Modify mapping**: Update filter mapping rules
- **Change scoring**: Modify scoring calculation logic

## 📝 Next Steps

After testing the pipeline:

1. **API Integration**: Connect pipeline to FastAPI endpoints
2. **Mobile Integration**: Test with mobile app image uploads
3. **Optimization**: Fine-tune based on real user data
4. **Expansion**: Add more products or analysis criteria
5. **Production**: Deploy with real Gemini API key

## 🚀 Production Setup

For production use:

1. **Set API Key**: `export GEMINI_API_KEY="your_key"`
2. **Test Real Images**: Use actual room photos
3. **Monitor Performance**: Track analysis accuracy
4. **User Feedback**: Collect recommendation quality ratings
5. **Iterate**: Improve based on usage patterns
