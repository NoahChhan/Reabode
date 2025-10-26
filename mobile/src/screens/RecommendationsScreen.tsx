import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  Surface,
  FAB,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProductRecommendation, RoomAnalysis } from '../types';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');

export default function RecommendationsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as any;
  const analysis = params?.analysis;
  const dimensions = params?.dimensions;
  const moodPreferences = params?.moodPreferences;

  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await apiService.getRecommendations(
        analysis,
        moodPreferences.budget,
        moodPreferences.style
      );
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: ProductRecommendation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Open product URL
    Linking.openURL(product.productUrl);
  };

  const toggleFavorite = (productId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'Furniture', label: 'Furniture' },
    { key: 'Decor', label: 'Decor' },
    { key: 'Lighting', label: 'Lighting' },
    { key: 'Textiles', label: 'Textiles' },
  ];

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.category === selectedCategory);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const renderProductCard = (product: ProductRecommendation) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => handleProductPress(product)}
    >
      <View style={styles.cardContainer}>
        {/* Product Image with Overlays */}
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          
          {/* Match Badge - Top Right */}
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>
              {Math.round(product.matchScore * 100)}% match
            </Text>
          </View>
          
          {/* Favorite Button - Top Left */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <IconButton
              icon={favorites.has(product.id) ? 'heart' : 'heart-outline'}
              iconColor={favorites.has(product.id) ? '#C85A54' : '#ffffff'}
              size={28}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>
        
        {/* Product Content */}
        <View style={styles.productContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text style={styles.productBrand} numberOfLines={1}>
            {product.brand}
          </Text>
          
          <Text style={styles.productPrice}>
            {formatPrice(product.price, product.currency)}
          </Text>
          
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
          
          {/* Category Chip */}
          <View style={styles.categoryChipContainer}>
            <View style={styles.productCategoryChip}>
              <Text style={styles.categoryChipText}>
                {product.category}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!analysis ? (
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium" style={styles.emptyTitle}>
            📸 Snap a photo first!
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtext}>
            Take a photo of your room to get personalized recommendations
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Camera' as never)}
            style={styles.cameraButton}
            icon="camera"
          >
            Take Photo
          </Button>
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#5D8658', '#7FB878']}
              style={styles.header}
            >
              <Text variant="headlineSmall" style={styles.headerTitle}>
                Recommendations
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                {recommendations.length} products found
              </Text>
            </LinearGradient>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Filter - only show when we have analysis */}
        {analysis && (
          <View style={styles.filterWrapper}>
            <Surface style={styles.filterContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
              >
                {categories.map((category) => (
                  <Chip
                    key={category.key}
                    selected={selectedCategory === category.key}
                    onPress={() => setSelectedCategory(category.key)}
                    style={styles.categoryChip}
                  >
                    {category.label}
                  </Chip>
                ))}
              </ScrollView>
            </Surface>
          </View>
        )}

        {/* Products Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5D8658" />
            <Text style={styles.loadingText}>
              Finding perfect products for your space...
            </Text>
          </View>
        ) : filteredRecommendations.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your filters or style preferences
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.emptyButtonText}>Back to Analysis</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredRecommendations.map(renderProductCard)}
          </View>
        )}
      </ScrollView>

      {analysis && (
        <FAB
          icon="cart"
          style={styles.fab}
          onPress={() => {
            // Navigate to shopping cart or favorites
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          label="View Cart"
        />
      )}
      </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf4dc',
  },
  headerContainer: {
    paddingTop: 50,
    backgroundColor: '#faf4dc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  content: {
    flex: 1,
    backgroundColor: '#faf4dc',
  },
  filterWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  filterContainer: {
    marginTop: -10,
    paddingVertical: 16,
    borderRadius: 0,
    width: '100%',
  },
  categoryContainer: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#E8F0E6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    backgroundColor: '#faf4dc',
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#2A3B28',
    fontFamily: 'Poppins-Bold',
  },
  emptySubtext: {
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
  },
  cameraButton: {
    marginTop: 16,
    backgroundColor: '#5D8658',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    backgroundColor: '#fff8e6',
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2A3B28',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  emptyButton: {
    backgroundColor: '#5D8658',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  productCard: {
    width: (width - 56) / 2,
    marginBottom: 16,
  },
  cardContainer: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E8F0E6',
    shadowColor: '#5D8658',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#7FB878',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  matchBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    margin: 0,
  },
  productContent: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A3B28',
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 22,
  },
  productBrand: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5D8658',
    marginTop: 8,
    fontFamily: 'Poppins-Bold',
  },
  productDescription: {
    fontSize: 13,
    color: '#4A6B45',
    lineHeight: 18,
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
  categoryChipContainer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  productCategoryChip: {
    backgroundColor: '#E8F0E6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryChipText: {
    fontSize: 12,
    color: '#4A6B45',
    fontFamily: 'Poppins-Medium',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#5D8658',
  },
});

