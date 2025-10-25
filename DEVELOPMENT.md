# Development Guide for Reabode AI Interior Designer

## 🚀 Quick Start for Hackathon

### 1. Clone and Setup
```bash
git clone <your-repo>
cd Reabode
npm run install:all
```

### 2. Start Development
```bash
npm run dev
```
This starts both backend (port 8000) and mobile app simultaneously.

### 3. Test the App
- **Mobile**: Scan QR code with Expo Go app
- **Backend**: Visit http://localhost:8000/docs for API documentation

## 📱 Mobile Development

### Key Features to Implement
1. **Camera Integration**: Room photo capture
2. **Room Analysis**: AI-powered style detection
3. **Product Recommendations**: Real product suggestions
4. **Shopping Integration**: Direct links to retailers

### Development Tips
- Use `expo start` for hot reload
- Test on both iOS and Android
- Use Expo Go app for quick testing
- Implement haptic feedback for better UX

### Key Screens
- `HomeScreen`: Project overview and quick actions
- `CameraScreen`: Room photo capture
- `RoomAnalysisScreen`: Dimensions and preferences
- `RecommendationsScreen`: Product suggestions

## 🔧 Backend Development

### API Endpoints to Implement
1. **Room Analysis**: `/analyze-room` with Claude API
2. **Product Recommendations**: `/recommendations` with Chroma
3. **Product Search**: `/products/search` with Composio
4. **Collaboration**: `/collaboration/join` with LiveKit

### AI Integration
- **Claude API**: Image analysis and style detection
- **ChromaDB**: Vector embeddings for product matching
- **Composio**: Product data automation
- **LiveKit**: Real-time collaboration

### Development Tips
- Use FastAPI's automatic documentation
- Test endpoints with `/docs` interface
- Implement proper error handling
- Add logging for debugging

## 🎯 Hackathon Strategy

### Phase 1: Foundation (Hours 1-4)
- ✅ Mobile app structure
- ✅ Camera integration
- ✅ Basic API endpoints
- ✅ UI components

### Phase 2: AI Integration (Hours 5-8)
- 🔄 Claude API for image analysis
- 🔄 Room analysis logic
- 🔄 Product recommendation engine
- 🔄 Chroma vector database

### Phase 3: Product Integration (Hours 9-12)
- ⏳ Target/IKEA API integration
- ⏳ Real product data
- ⏳ Product filtering
- ⏳ Shopping cart

### Phase 4: Polish (Hours 13-18)
- ⏳ LiveKit collaboration
- ⏳ Mood board features
- ⏳ AR preview (if time)
- ⏳ Demo preparation

## 🔌 Sponsor API Integration

### Claude API
```python
# Image analysis
response = claude.analyze_image(
    image=base64_image,
    prompt="Analyze this room for interior design recommendations"
)
```

### ChromaDB
```python
# Vector storage
collection = chroma_client.create_collection("products")
collection.add(embeddings=product_embeddings, documents=product_descriptions)
```

### Composio
```python
# Product data automation
composio_client.get_products(
    retailer="target",
    category="furniture",
    filters={"price_range": [100, 500]}
)
```

### LiveKit
```python
# Real-time collaboration
room = livekit.Room()
room.connect(token=user_token)
room.publish_track(video_track)
```

## 🧪 Testing Strategy

### Mobile Testing
- Test camera functionality on real devices
- Verify image upload to backend
- Test product recommendation display
- Validate shopping cart functionality

### Backend Testing
- Test AI analysis with real room images
- Verify product recommendation accuracy
- Test API endpoints with mobile app
- Validate real-time collaboration

### Integration Testing
- End-to-end room analysis workflow
- Product recommendation accuracy
- Shopping cart to retailer integration
- Real-time collaboration features

## 🚀 Demo Preparation

### Key Demo Points
1. **Room Photo Capture**: Show camera integration
2. **AI Analysis**: Demonstrate style detection
3. **Product Recommendations**: Show personalized suggestions
4. **Shopping Integration**: Direct links to retailers
5. **Real-time Collaboration**: Multiple users working together

### Demo Flow
1. Open app and scan room
2. Enter dimensions and preferences
3. Show AI analysis results
4. Display product recommendations
5. Demonstrate shopping integration
6. Show collaboration features

## 📊 Success Metrics

### Technical
- ✅ Mobile app runs smoothly
- ✅ AI analysis works with real images
- ✅ Product recommendations are relevant
- ✅ Shopping integration works
- ✅ Real-time features function

### User Experience
- ✅ Intuitive camera workflow
- ✅ Fast AI analysis
- ✅ Relevant product suggestions
- ✅ Easy shopping experience
- ✅ Smooth collaboration

## 🛠️ Troubleshooting

### Common Issues
- **Camera not working**: Check permissions
- **API calls failing**: Verify backend is running
- **Images not uploading**: Check base64 encoding
- **Recommendations empty**: Verify AI integration
- **Shopping links broken**: Check product URLs

### Debug Tips
- Use console.log for mobile debugging
- Check FastAPI logs for backend issues
- Test API endpoints with Postman
- Verify environment variables
- Check network connectivity

## 🎉 Final Checklist

### Before Demo
- [ ] Mobile app builds successfully
- [ ] Backend API is running
- [ ] AI analysis works with test images
- [ ] Product recommendations are relevant
- [ ] Shopping links work
- [ ] Real-time features function
- [ ] Demo flow is smooth
- [ ] All sponsor integrations work

### Demo Day
- [ ] Have backup plan if live demo fails
- [ ] Prepare screen recordings
- [ ] Practice demo flow
- [ ] Have team members ready
- [ ] Prepare for Q&A
- [ ] Show technical implementation
- [ ] Highlight sponsor integrations

---

**Good luck with your hackathon! 🚀**