import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
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
  const { analysis, dimensions, moodPreferences } = route.params as {
    analysis: RoomAnalysis;
    dimensions: any;
    moodPreferences: any;
  };

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
    <Card key={product.id} style={styles.productCard}>
      <TouchableOpacity onPress={() => handleProductPress(product)}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <Card.Content style={styles.productContent}>
          <View style={styles.productHeader}>
            <Text variant="titleMedium" style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <IconButton
              icon={favorites.has(product.id) ? 'heart' : 'heart-outline'}
              iconColor={favorites.has(product.id) ? '#ef4444' : '#6b7280'}
              size={20}
              onPress={() => toggleFavorite(product.id)}
            />
          </View>
          
          <Text variant="bodyMedium" style={styles.productBrand}>
            {product.brand}
          </Text>
          
          <Text variant="titleLarge" style={styles.productPrice}>
            {formatPrice(product.price, product.currency)}
          </Text>
          
          <Text variant="bodySmall" style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
          
          <View style={styles.productTags}>
            <Chip
              mode="outlined"
              compact
              style={styles.tag}
            >
              {product.style}
            </Chip>
            <Chip
              mode="outlined"
              compact
              style={styles.tag}
            >
              {Math.round(product.matchScore * 100)}% match
            </Chip>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Recommendations
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          {recommendations.length} products found
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
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

        {/* Products Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading recommendations...</Text>
          </View>
        ) : filteredRecommendations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No products found</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Try adjusting your filters or preferences
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredRecommendations.map(renderProductCard)}
          </View>
        )}
      </ScrollView>

      <FAB
        icon="shopping-cart"
        style={styles.fab}
        onPress={() => {
          // Navigate to shopping cart or favorites
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        label="View Cart"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterContainer: {
    marginTop: -10,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  categoryContainer: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptySubtext: {
    opacity: 0.7,
    marginTop: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productContent: {
    padding: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    marginRight: 8,
  },
  productBrand: {
    opacity: 0.7,
    marginBottom: 4,
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  productDescription: {
    opacity: 0.8,
    marginBottom: 12,
  },
  productTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 4,
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
