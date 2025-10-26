# Reabode AI - Hackathon Team Tasks (10 Hours)

**Goal:** Working interior design app with Claude AI + real IKEA products  
**Approach:** 4 parallel workstreams - everyone works independently

---

## 🎯 Quick Start (Everyone - 15 min)

### Setup Your Environment
```bash
# Clone and enter directory
cd /Users/noahchhan/Documents/Reabode/Reabode

# Backend setup
cd backend
pip install -r requirements.txt

# Mobile setup
cd ../mobile
npm install

# Test that everything runs
cd ../
npm run dev  # This starts both backend and mobile
```

### Create Your API Keys
- **Claude API:** Sign up at console.anthropic.com (Backend Person 1 needs this)
- Each person should test their environment works before starting tasks

---

## 👤 PERSON 1: Backend - Claude AI Integration

**Goal:** Get Claude API analyzing room images and returning structured data

### Task 1A: Environment Setup (15 min)
1. Create `backend/.env.example`:
```bash
ANTHROPIC_API_KEY=sk-ant-...
API_BASE_URL=http://localhost:8000
```
2. Copy to `backend/.env` and add your real Claude API key
3. Update `backend/requirements.txt`, add if missing:
```
anthropic==0.7.0
python-dotenv==1.0.0
```
4. Run `pip install -r requirements.txt`

### Task 1B: Create Claude Service (90 min)
1. Create file: `backend/services/claude_service.py`
```python
import anthropic
import os
from typing import Dict, List
import json
import base64

class ClaudeService:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
    
    def analyze_room_image(self, base64_image: str) -> Dict:
        """
        Analyze a room image and return structured data
        """
        try:
            # Remove data:image/jpeg;base64, prefix if present
            if "base64," in base64_image:
                base64_image = base64_image.split("base64,")[1]
            
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": base64_image,
                                },
                            },
                            {
                                "type": "text",
                                "text": """Analyze this interior space and return a JSON response with:
1. roomType: The type of room (living room, bedroom, kitchen, etc.)
2. currentStyle: The current design style (modern, traditional, minimalist, etc.)
3. colorScheme: Array of main colors present (e.g., ["white", "gray", "blue"])
4. furniture: Array of furniture items visible (e.g., ["sofa", "coffee table"])
5. improvements: Array of 3-5 suggested improvements
6. confidence: Your confidence level as a decimal (0.0 to 1.0)

Return ONLY valid JSON, no other text."""
                            }
                        ],
                    }
                ],
            )
            
            # Parse Claude's response
            response_text = message.content[0].text
            analysis = json.loads(response_text)
            
            return analysis
            
        except Exception as e:
            print(f"Claude API error: {e}")
            # Return mock data as fallback
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

claude_service = ClaudeService()
```

### Task 1C: Update Main API (30 min)
1. Edit `backend/main.py`, add imports at top:
```python
from dotenv import load_dotenv
load_dotenv()
```

2. Import the service:
```python
from services.claude_service import claude_service
```

3. Update the `/analyze-room` endpoint (around line 88):
```python
@app.post("/analyze-room", response_model=RoomAnalysis)
async def analyze_room(
    images: List[RoomImage],
    dimensions: RoomDimensions,
    moodPreferences: MoodPreferences
):
    """
    Analyze room images using Claude AI
    """
    try:
        # Use first image for analysis
        if not images or len(images) == 0:
            raise HTTPException(status_code=400, detail="No images provided")
        
        first_image = images[0]
        image_data = first_image.base64 or first_image.uri
        
        # Call Claude service
        analysis_data = claude_service.analyze_room_image(image_data)
        
        # Convert to RoomAnalysis model
        analysis = RoomAnalysis(
            roomType=analysis_data.get("roomType", "Unknown"),
            currentStyle=analysis_data.get("currentStyle", "Modern"),
            colorScheme=analysis_data.get("colorScheme", []),
            furniture=analysis_data.get("furniture", []),
            improvements=analysis_data.get("improvements", []),
            confidence=analysis_data.get("confidence", 0.8)
        )
        
        return analysis
        
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
```

### Task 1D: Test It (15 min)
1. Start backend: `python -m uvicorn main:app --reload`
2. Go to `http://localhost:8000/docs`
3. Test `/analyze-room` with sample data
4. Verify it returns structured JSON

**Deliverable:** Working Claude API integration that analyzes room images

---

## 👤 PERSON 2: Backend - IKEA Product Database & Matching

**Goal:** Create product database and smart matching algorithm

### Task 2A: Create Product Database (90 min)
1. Create file: `backend/data/ikea_products.json`
2. Manually curate 30-50 real IKEA products

**Template:**
```json
{
  "products": [
    {
      "id": "ikea-kivik-001",
      "name": "KIVIK 3-seat sofa",
      "brand": "IKEA",
      "price": 699.00,
      "currency": "USD",
      "category": "Furniture",
      "subcategory": "Sofas",
      "style": ["Modern", "Scandinavian"],
      "colors": ["gray", "white"],
      "dimensions": {"length": 90, "width": 37, "height": 33},
      "imageUrl": "https://www.ikea.com/us/en/images/products/kivik-3-seat-sofa-hillared-dark-gray__0951635_pe803140_s5.jpg",
      "productUrl": "https://www.ikea.com/us/en/p/kivik-3-seat-sofa-hillared-dark-gray-s09307223/",
      "description": "Generous seating with soft, thick cushions. Comfortable support for your back and soft armrests make it easy to enjoy a good book or a long conversation."
    }
  ]
}
```

**Categories to include (aim for 40-50 total):**
- **Sofas (8):** KIVIK, EKTORP, SÖDERHAMN, VIMLE, FRIHETEN
- **Chairs (8):** POÄNG, STRANDMON, JÄRVFJÄLLET, MARKUS, EKEDALEN
- **Coffee Tables (6):** LACK, HEMNES, STOCKHOLM, VITTSJÖ, LISTERBY
- **Storage (8):** KALLAX, BILLY, EKET, BESTÅ, IVAR
- **Lighting (6):** RANARP, HEKTAR, TERTIAL, SKURUP, FÄRGRIK
- **Beds (4):** MALM, HEMNES, SLATTUM
- **Decor (6):** FEJKA plants, SKURAR candles, SINNERLIG baskets, RIBBA frames

**Tips:**
- Go to ikea.com/us and browse categories
- Copy real product names, prices, and URLs
- Use actual IKEA product images
- Focus on popular, versatile items
- Mix price ranges: $20-$1000

### Task 2B: Create Product Service (60 min)
1. Create file: `backend/services/product_service.py`

```python
import json
from typing import List, Dict
from pathlib import Path

class ProductService:
    def __init__(self):
        self.products = self._load_products()
    
    def _load_products(self) -> List[Dict]:
        """Load products from JSON file"""
        json_path = Path(__file__).parent.parent / "data" / "ikea_products.json"
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
                return data.get('products', [])
        except Exception as e:
            print(f"Error loading products: {e}")
            return []
    
    def match_products(
        self,
        room_type: str,
        style_preferences: List[str],
        color_preferences: List[str],
        budget: str,
        limit: int = 10
    ) -> List[Dict]:
        """
        Match products based on room analysis and user preferences
        """
        # Filter by budget first
        budget_ranges = {
            "low": (0, 200),
            "medium": (200, 800),
            "high": (800, 10000)
        }
        min_price, max_price = budget_ranges.get(budget, (0, 10000))
        
        filtered = [
            p for p in self.products 
            if min_price <= p['price'] <= max_price
        ]
        
        # Calculate match scores
        scored_products = []
        for product in filtered:
            score = 0.0
            
            # Style matching (40% weight)
            product_styles = [s.lower() for s in product.get('style', [])]
            user_styles = [s.lower() for s in style_preferences]
            style_matches = sum(1 for s in user_styles if s in product_styles)
            if style_matches > 0:
                score += 0.4
            
            # Color matching (30% weight)
            product_colors = [c.lower() for c in product.get('colors', [])]
            user_colors = [c.lower() for c in color_preferences]
            color_matches = sum(1 for c in user_colors if c in product_colors)
            if color_matches > 0:
                score += 0.3
            
            # Category relevance (30% weight)
            # Living rooms need sofas, chairs, tables
            # Bedrooms need beds, dressers, lighting
            category = product.get('category', '').lower()
            subcategory = product.get('subcategory', '').lower()
            
            room_categories = {
                "living room": ["sofas", "chairs", "coffee tables", "lighting", "storage"],
                "bedroom": ["beds", "dressers", "lighting", "storage"],
                "kitchen": ["tables", "chairs", "storage"],
                "office": ["desks", "chairs", "storage", "lighting"]
            }
            
            relevant_categories = room_categories.get(room_type.lower(), [])
            if any(cat in subcategory or cat in category for cat in relevant_categories):
                score += 0.3
            
            scored_products.append({
                **product,
                'matchScore': round(score, 2)
            })
        
        # Sort by match score and return top results
        scored_products.sort(key=lambda x: x['matchScore'], reverse=True)
        return scored_products[:limit]

product_service = ProductService()
```

### Task 2C: Update Recommendations Endpoint (30 min)
1. Edit `backend/main.py`, add import:
```python
from services.product_service import product_service
```

2. Update `/recommendations` endpoint (around line 113):
```python
@app.post("/recommendations", response_model=List[ProductRecommendation])
async def get_recommendations(
    analysis: RoomAnalysis,
    budget: str,
    style: List[str]
):
    """
    Get product recommendations based on room analysis
    """
    try:
        # Get matched products
        matched = product_service.match_products(
            room_type=analysis.roomType,
            style_preferences=style,
            color_preferences=analysis.colorScheme,
            budget=budget,
            limit=10
        )
        
        # Convert to ProductRecommendation models
        recommendations = [
            ProductRecommendation(
                id=p['id'],
                name=p['name'],
                brand=p['brand'],
                price=p['price'],
                currency=p['currency'],
                imageUrl=p['imageUrl'],
                productUrl=p['productUrl'],
                category=p['category'],
                style=', '.join(p.get('style', [])),
                colors=p['colors'],
                dimensions=p.get('dimensions'),
                matchScore=p['matchScore'],
                description=p['description']
            )
            for p in matched
        ]
        
        return recommendations
        
    except Exception as e:
        print(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendations failed: {str(e)}")
```

### Task 2D: Test It (15 min)
1. Create the data directory: `mkdir -p backend/data`
2. Verify your JSON file is valid
3. Test `/recommendations` endpoint in docs
4. Verify it returns scored products

**Deliverable:** 40-50 real IKEA products with working matching algorithm

---

## 👤 PERSON 3: Mobile - API Integration & Image Upload

**Goal:** Connect mobile app to backend and get image upload working

### Task 3A: Fix API Connection (30 min)
1. Find your computer's local IP:
```bash
# Mac/Linux:
ifconfig | grep inet

# Windows:
ipconfig

# Look for something like: 192.168.1.XXX
```

2. Edit `mobile/src/services/api.ts` (line 10):
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.XXX:8000';
// Replace XXX with your actual IP
```

3. Add better error handling in the same file:
```typescript
private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`API Request: ${url}`);
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    Alert.alert(
      'Connection Error',
      'Could not reach server. Make sure backend is running.'
    );
    throw error;
  }
}
```

4. Add Alert import at top:
```typescript
import { Alert } from 'react-native';
```

### Task 3B: Fix Image Upload (60 min)
1. Edit `mobile/src/screens/CameraScreen.tsx`

2. Update the `takePicture` function (around line 35):
```typescript
const takePicture = async () => {
  if (!cameraRef.current || isCapturing) return;

  setIsCapturing(true);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  try {
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,  // Compress to reduce size
      base64: true,
    });

    // Ensure proper base64 format
    let base64Data = photo.base64;
    if (base64Data && !base64Data.startsWith('data:image')) {
      base64Data = `data:image/jpeg;base64,${base64Data}`;
    }

    const newImage: RoomImage = {
      id: Date.now().toString(),
      uri: photo.uri,
      base64: base64Data,
      timestamp: Date.now(),
    };

    setCapturedImages(prev => [...prev, newImage]);
    Alert.alert('Success', 'Photo captured!');
  } catch (error) {
    console.error('Error taking picture:', error);
    Alert.alert('Error', 'Failed to take picture. Please try again.');
  } finally {
    setIsCapturing(false);
  }
};
```

3. Update `pickImageFromGallery` function:
```typescript
const pickImageFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please grant access to your photo library');
    return;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      let base64Data = result.assets[0].base64;
      if (base64Data && !base64Data.startsWith('data:image')) {
        base64Data = `data:image/jpeg;base64,${base64Data}`;
      }

      const newImage: RoomImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        base64: base64Data,
        timestamp: Date.now(),
      };

      setCapturedImages(prev => [...prev, newImage]);
      Alert.alert('Success', 'Image loaded!');
    }
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to load image');
  }
};
```

### Task 3C: Test Image Display (30 min)
1. Update the image preview in `CameraScreen.tsx` (around line 177):
```typescript
{capturedImages.length > 0 && (
  <Surface style={styles.previewContainer}>
    <Text variant="titleMedium" style={styles.previewTitle}>
      Captured Images ({capturedImages.length})
    </Text>
    <View style={styles.imageGrid}>
      {capturedImages.map((image) => (
        <View key={image.id} style={styles.imageItem}>
          <Image
            source={{ uri: image.uri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeImage(image.id)}
          >
            <IconButton icon="close" size={16} iconColor="white" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
    <Button
      mode="contained"
      onPress={proceedToAnalysis}
      style={styles.analyzeButton}
      icon="brain"
    >
      Analyze Room
    </Button>
  </Surface>
)}
```

2. Add thumbnail style (in styles section):
```typescript
thumbnail: {
  width: 60,
  height: 60,
  borderRadius: 8,
},
```

### Task 3D: Add Loading States (30 min)
1. Add loading state variable at top of `CameraScreen`:
```typescript
const [uploading, setUploading] = useState(false);
```

2. Update `proceedToAnalysis`:
```typescript
const proceedToAnalysis = async () => {
  if (capturedImages.length === 0) {
    Alert.alert('No Images', 'Please capture at least one room image');
    return;
  }

  setUploading(true);
  try {
    // Navigate with images
    navigation.navigate('RoomAnalysis' as never, { 
      images: capturedImages 
    } as never);
  } catch (error) {
    Alert.alert('Error', 'Failed to proceed to analysis');
  } finally {
    setUploading(false);
  }
};
```

3. Show loading indicator in button:
```typescript
<Button
  mode="contained"
  onPress={proceedToAnalysis}
  style={styles.analyzeButton}
  icon="brain"
  loading={uploading}
  disabled={uploading}
>
  {uploading ? 'Processing...' : 'Analyze Room'}
</Button>
```

**Deliverable:** Working image capture and upload to backend

---

## 👤 PERSON 4: Mobile - UI Polish & Product Display

**Goal:** Make the app look amazing and display products beautifully

### Task 4A: Polish RoomAnalysisScreen (90 min)
1. Edit `mobile/src/screens/RoomAnalysisScreen.tsx`

2. Add loading animation when analyzing (in `renderStep` for step 2):
```typescript
const [isAnalyzing, setIsAnalyzing] = useState(false);

// In handleAnalyze function:
const handleAnalyze = async () => {
  setIsAnalyzing(true);
  setLoading(true);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  try {
    const analysisResult = await apiService.analyzeRoom(
      images,
      dimensions,
      moodPreferences
    );
    setAnalysis(analysisResult);
    setCurrentStep(3);
    
    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error('Analysis failed:', error);
    Alert.alert('Analysis Failed', 'Please try again or check your connection');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } finally {
    setLoading(false);
    setIsAnalyzing(false);
  }
};
```

3. Add beautiful loading screen:
```typescript
{isAnalyzing && (
  <View style={styles.loadingOverlay}>
    <LinearGradient
      colors={['#6366f1', '#8b5cf6']}
      style={styles.loadingGradient}
    >
      <ActivityIndicator size="large" color="white" />
      <Text variant="headlineSmall" style={styles.loadingText}>
        AI is analyzing your space...
      </Text>
      <Text variant="bodyMedium" style={styles.loadingSubtext}>
        This may take a few seconds
      </Text>
    </LinearGradient>
  </View>
)}
```

4. Add styles:
```typescript
loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
},
loadingGradient: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 40,
},
loadingText: {
  color: 'white',
  marginTop: 20,
  textAlign: 'center',
  fontWeight: 'bold',
},
loadingSubtext: {
  color: 'white',
  opacity: 0.8,
  marginTop: 8,
  textAlign: 'center',
},
```

5. Improve analysis results display (step 3):
```typescript
case 3:
  return (
    <View style={styles.stepContainer}>
      <Text variant="headlineSmall" style={styles.stepTitle}>
        ✨ Analysis Complete!
      </Text>
      
      {analysis && (
        <>
          <Card style={styles.analysisCard} elevation={2}>
            <Card.Content>
              <View style={styles.analysisRow}>
                <Text variant="titleMedium">🏠 Room Type:</Text>
                <Text variant="bodyLarge">{analysis.roomType}</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.analysisRow}>
                <Text variant="titleMedium">🎨 Current Style:</Text>
                <Text variant="bodyLarge">{analysis.currentStyle}</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.analysisSection}>
                <Text variant="titleMedium">🎨 Colors:</Text>
                <View style={styles.colorChips}>
                  {analysis.colorScheme.map((color, idx) => (
                    <Chip key={idx} style={styles.colorChip} mode="outlined">
                      {color}
                    </Chip>
                  ))}
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.analysisSection}>
                <Text variant="titleMedium">🪑 Existing Furniture:</Text>
                <View style={styles.furnitureList}>
                  {analysis.furniture.map((item, idx) => (
                    <Chip key={idx} style={styles.furnitureChip}>
                      {item}
                    </Chip>
                  ))}
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.analysisSection}>
                <Text variant="titleMedium">💡 Suggestions:</Text>
                {analysis.improvements.map((improvement, idx) => (
                  <Text key={idx} variant="bodyMedium" style={styles.improvement}>
                    • {improvement}
                  </Text>
                ))}
              </View>
              
              <View style={styles.confidenceSection}>
                <Text variant="titleSmall">Confidence Score</Text>
                <ProgressBar 
                  progress={analysis.confidence} 
                  color="#10b981"
                  style={styles.progressBar}
                />
                <Text variant="bodySmall">{Math.round(analysis.confidence * 100)}%</Text>
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.continueButton}
            icon="arrow-right"
          >
            Get Product Recommendations
          </Button>
        </>
      )}
    </View>
  );
```

6. Add new styles:
```typescript
analysisRow: {
  marginBottom: 12,
},
analysisSection: {
  marginBottom: 12,
},
colorChips: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
},
colorChip: {
  marginRight: 8,
  marginBottom: 8,
},
furnitureList: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
},
furnitureChip: {
  marginRight: 8,
  marginBottom: 8,
},
improvement: {
  marginTop: 4,
  marginLeft: 8,
},
divider: {
  marginVertical: 12,
},
confidenceSection: {
  marginTop: 16,
  alignItems: 'center',
},
progressBar: {
  width: '100%',
  height: 8,
  marginVertical: 8,
  borderRadius: 4,
},
```

### Task 4B: Beautify Product Display (90 min)
1. Edit `mobile/src/screens/RecommendationsScreen.tsx`

2. Improve product card rendering:
```typescript
const renderProductCard = (product: ProductRecommendation) => (
  <Card key={product.id} style={styles.productCard} elevation={3}>
    <TouchableOpacity 
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>
            {Math.round(product.matchScore * 100)}% match
          </Text>
        </View>
      </View>
      
      <Card.Content style={styles.productContent}>
        <View style={styles.productHeader}>
          <Text 
            variant="titleMedium" 
            style={styles.productName} 
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <IconButton
            icon={favorites.has(product.id) ? 'heart' : 'heart-outline'}
            iconColor={favorites.has(product.id) ? '#ef4444' : '#6b7280'}
            size={24}
            onPress={() => toggleFavorite(product.id)}
            style={styles.favoriteButton}
          />
        </View>
        
        <Text variant="bodyMedium" style={styles.productBrand}>
          {product.brand}
        </Text>
        
        <View style={styles.priceRow}>
          <Text variant="titleLarge" style={styles.productPrice}>
            {formatPrice(product.price, product.currency)}
          </Text>
        </View>
        
        <Text 
          variant="bodySmall" 
          style={styles.productDescription} 
          numberOfLines={2}
        >
          {product.description}
        </Text>
        
        <View style={styles.productFooter}>
          <Chip
            mode="flat"
            compact
            style={styles.categoryChip}
            textStyle={styles.categoryChipText}
          >
            {product.category}
          </Chip>
        </View>
      </Card.Content>
    </TouchableOpacity>
  </Card>
);
```

3. Update styles for better visuals:
```typescript
productCard: {
  width: (width - 60) / 2,
  marginBottom: 16,
  overflow: 'hidden',
  backgroundColor: 'white',
  borderRadius: 12,
},
productImageContainer: {
  position: 'relative',
  width: '100%',
  height: 140,
  backgroundColor: '#f5f5f5',
},
productImage: {
  width: '100%',
  height: '100%',
},
matchBadge: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: '#10b981',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
},
matchText: {
  color: 'white',
  fontSize: 11,
  fontWeight: 'bold',
},
productContent: {
  padding: 12,
  minHeight: 160,
},
productHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 4,
},
productName: {
  flex: 1,
  marginRight: 4,
  fontWeight: '600',
},
favoriteButton: {
  margin: 0,
  padding: 0,
},
productBrand: {
  opacity: 0.6,
  marginBottom: 8,
  fontSize: 12,
},
priceRow: {
  marginBottom: 8,
},
productPrice: {
  fontWeight: 'bold',
  color: '#6366f1',
  fontSize: 18,
},
productDescription: {
  opacity: 0.8,
  marginBottom: 12,
  lineHeight: 18,
},
productFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
categoryChip: {
  backgroundColor: '#f1f5f9',
  height: 24,
},
categoryChipText: {
  fontSize: 11,
  color: '#64748b',
},
```

### Task 4C: Add Empty States (30 min)
1. Add beautiful empty state when no products found:
```typescript
{loading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6366f1" />
    <Text style={styles.loadingText}>Finding perfect products...</Text>
  </View>
) : filteredRecommendations.length === 0 ? (
  <View style={styles.emptyContainer}>
    <Text variant="displaySmall">🔍</Text>
    <Text variant="headlineSmall" style={styles.emptyTitle}>
      No products found
    </Text>
    <Text variant="bodyMedium" style={styles.emptySubtext}>
      Try adjusting your filters or style preferences
    </Text>
    <Button 
      mode="outlined" 
      onPress={() => navigation.goBack()}
      style={styles.emptyButton}
    >
      Back to Analysis
    </Button>
  </View>
) : (
  // Existing products grid
)}
```

2. Add styles:
```typescript
emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 60,
  paddingHorizontal: 40,
},
emptyTitle: {
  marginTop: 16,
  marginBottom: 8,
  textAlign: 'center',
},
emptyButton: {
  marginTop: 20,
},
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 60,
},
loadingText: {
  marginTop: 16,
  color: '#6b7280',
},
```

**Deliverable:** Beautiful, polished UI with smooth user experience

---

## 🔄 Integration Testing (All Team - 30 min)

Once everyone finishes their tasks, test together:

### Test Checklist
1. **Backend Running:**
   - [ ] Start: `cd backend && python -m uvicorn main:app --reload`
   - [ ] Visit: `http://localhost:8000/docs`
   - [ ] Test `/health` endpoint

2. **Mobile Connected:**
   - [ ] Start: `cd mobile && npx expo start --tunnel`
   - [ ] Scan QR with Expo Go
   - [ ] App loads without errors

3. **Full Flow:**
   - [ ] Take photo or select from gallery
   - [ ] Enter dimensions: 12 x 15 x 9 feet
   - [ ] Select: Modern, Cozy, Medium budget
   - [ ] Tap "Analyze Room"
   - [ ] See loading animation
   - [ ] View analysis results
   - [ ] Tap "Get Recommendations"
   - [ ] See 6-10 IKEA products
   - [ ] Tap product → Opens IKEA website

4. **Error Handling:**
   - [ ] Try with no internet → Shows error
   - [ ] Try with fake API key → Falls back to mock
   - [ ] Try with no image → Shows alert

---

## 🚀 Demo Preparation (All Team - 45 min)

### Record Backup Video (15 min)
- Use phone screen recording
- Walk through entire flow
- 2-3 minutes max
- Save as backup if live demo fails

### Practice Demo Script (20 min)
**[Person presenting shows phone to judges]**

**Opening (30 sec):**
"Hi! We're Team Reabode. We noticed that when people shop for furniture online, they struggle to visualize how it will look in their actual space. We built an AI-powered interior design assistant that solves this."

**Demo (90 sec):**
1. "Let me show you. I'll take a photo of this living room..." [Take photo]
2. "Now I enter the room dimensions..." [Enter 12x15x9]
3. "And select my design preferences - I want a Modern, Cozy style..." [Select options]
4. "Watch what happens when I analyze..." [Tap analyze]
5. "Our AI, powered by Claude's vision API, analyzes the space in real-time..."
6. "And here's the analysis - it identified the room type, current style, colors, and gave specific improvement suggestions"
7. "Now here's the magic - based on this analysis, we show real IKEA products..."
8. "Each product has a match score showing how well it fits"
9. "And when I tap any product, it takes me directly to IKEA where I can buy it"

**Tech Highlights (30 sec):**
"Technically, we're using Claude's computer vision API to analyze room images and extract design insights. We built a smart matching algorithm that scores 50 real IKEA products based on style, color, and room type. The mobile app is React Native with Expo, and the backend is FastAPI in Python."

**Closing (10 sec):**
"This makes interior design accessible to everyone. Questions?"

### Final Checklist
- [ ] Phone fully charged
- [ ] Backend running
- [ ] Mobile connected
- [ ] Test photos ready
- [ ] Backup video on laptop
- [ ] Everyone knows their part
- [ ] Claude API key working
- [ ] IKEA links working

---

## 🆘 Quick Troubleshooting

### "Cannot connect to backend"
```bash
# Person 3: Check your IP in api.ts
# Make sure it matches your computer's actual IP
# Test: curl http://192.168.1.XXX:8000/health
```

### "Claude API not working"
```python
# Person 1: Check .env file
# Verify: print(os.getenv("ANTHROPIC_API_KEY"))
# The app will fall back to mock data if it fails
```

### "No products showing"
```python
# Person 2: Check JSON file location
# Should be: backend/data/ikea_products.json
# Test product_service in Python console
```

### "Mobile app crashes"
```bash
# Person 3 & 4: Check console for errors
# Common fix: Clear cache with npx expo start -c
# Check all imports are correct
```

---

## ✅ Definition of Done

### Person 1 (Backend - Claude):
- [ ] Claude API key in .env
- [ ] claude_service.py created and working
- [ ] /analyze-room returns structured JSON
- [ ] Falls back to mock data on error
- [ ] Tested with sample image

### Person 2 (Backend - Products):
- [ ] ikea_products.json with 40+ products
- [ ] product_service.py with matching algorithm
- [ ] /recommendations returns scored products
- [ ] Budget filtering works
- [ ] Style matching works

### Person 3 (Mobile - API):
- [ ] API connection works
- [ ] Images upload successfully
- [ ] Error messages show clearly
- [ ] Loading states work
- [ ] Can navigate full flow

### Person 4 (Mobile - UI):
- [ ] Analysis screen looks polished
- [ ] Products display beautifully
- [ ] Loading animations smooth
- [ ] Empty states handled
- [ ] Tap to IKEA works

---

## 🎯 Priority if Running Out of Time

**Must Have (P0) - Everyone stops other work:**
1. Claude analysis working (Person 1)
2. At least 20 products (Person 2)
3. Image upload working (Person 3)
4. Products display (Person 4)

**Should Have (P1):**
5. Error handling (Persons 3 & 4)
6. Loading animations (Person 4)
7. Match scoring (Person 2)

**Nice to Have (P2):**
8. Favorites (Person 4)
9. Filters (Person 4)
10. Advanced styling (Person 4)

---

## 📞 Communication

Use these signals when testing together:
- 🟢 "My part works!" - Task complete
- 🟡 "Almost there" - Need 30 more min
- 🔴 "Blocked!" - Need help ASAP

---

## 🎉 You Got This!

Remember:
- **Working demo > Perfect code**
- **Help each other when blocked**
- **Test integration frequently**
- **Have fun!**

**Let's build something amazing! 🚀**

