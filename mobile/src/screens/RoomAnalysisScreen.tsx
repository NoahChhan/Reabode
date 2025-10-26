import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Chip,
  Surface,
  ProgressBar,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RoomImage, RoomDimensions, MoodPreferences, RoomAnalysis } from '../types';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');

export default function RoomAnalysisScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { images } = route.params as { images: RoomImage[] };

  const [dimensions, setDimensions] = useState<RoomDimensions>({
    length: 0,
    width: 0,
    height: 0,
    unit: 'feet',
  });
  const [moodPreferences, setMoodPreferences] = useState<MoodPreferences>({
    style: [],
    colors: [],
    budget: 'medium',
    adjectives: [],
  });
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const styleOptions = [
    'Modern', 'Minimalist', 'Scandinavian', 'Industrial', 'Bohemian',
    'Traditional', 'Contemporary', 'Rustic', 'Mid-Century', 'Art Deco'
  ];

  const colorOptions = [
    'White', 'Black', 'Gray', 'Blue', 'Green', 'Red', 'Yellow',
    'Orange', 'Purple', 'Pink', 'Brown', 'Beige'
  ];

  const adjectiveOptions = [
    'Cozy', 'Bright', 'Spacious', 'Warm', 'Cool', 'Elegant',
    'Playful', 'Serene', 'Bold', 'Subtle', 'Luxurious', 'Minimal'
  ];

  const budgetOptions = [
    { value: 'low', label: 'Budget ($0-500)', color: '#7FB878' },
    { value: 'medium', label: 'Mid-range ($500-2000)', color: '#5D8658' },
    { value: 'high', label: 'Premium ($2000+)', color: '#4A6B45' },
  ];

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Analysis failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (navigation.navigate as any)('Recommendations', { 
      analysis, 
      dimensions, 
      moodPreferences 
    });
  };

  const toggleStyle = (style: string) => {
    setMoodPreferences(prev => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter(s => s !== style)
        : [...prev.style, style]
    }));
  };

  const toggleColor = (color: string) => {
    setMoodPreferences(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const toggleAdjective = (adjective: string) => {
    setMoodPreferences(prev => ({
      ...prev,
      adjectives: prev.adjectives.includes(adjective)
        ? prev.adjectives.filter(a => a !== adjective)
        : [...prev.adjectives, adjective]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.stepTitle}>
              Room Dimensions
            </Text>
            <Text variant="bodyMedium" style={styles.stepDescription}>
              Enter your room dimensions for accurate recommendations
            </Text>
            
            <View style={styles.dimensionsContainer}>
              <TextInput
                label="Length (inches)"
                placeholder="Length (inches)"
                value={dimensions.length.toString()}
                onChangeText={(text) => setDimensions(prev => ({
                  ...prev,
                  length: parseFloat(text) || 0
                }))}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Width (inches)"
                placeholder="Width (inches)"
                value={dimensions.width.toString()}
                onChangeText={(text) => setDimensions(prev => ({
                  ...prev,
                  width: parseFloat(text) || 0
                }))}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Height (inches)"
                placeholder="Height (inches)"
                value={dimensions.height.toString()}
                onChangeText={(text) => setDimensions(prev => ({
                  ...prev,
                  height: parseFloat(text) || 0
                }))}
                keyboardType="numeric"
                style={styles.input}
              />
              <Text style={styles.helperText}>
                Enter room dimensions in inches for best accuracy
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={() => setCurrentStep(1)}
              style={styles.continueButton}
            >
              Continue
            </Button>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.stepTitle}>
              Style Preferences
            </Text>
            <Text variant="bodyMedium" style={styles.stepDescription}>
              Select styles that appeal to you
            </Text>
            
            <View style={styles.chipsContainer}>
              {styleOptions.map((style) => (
                <Chip
                  key={style}
                  selected={moodPreferences.style.includes(style)}
                  onPress={() => toggleStyle(style)}
                  style={styles.chip}
                >
                  {style}
                </Chip>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={() => setCurrentStep(2)}
              style={styles.continueButton}
            >
              Continue
            </Button>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.stepTitle}>
              Color & Mood
            </Text>
            <Text variant="bodyMedium" style={styles.stepDescription}>
              Choose your preferred colors and mood adjectives
            </Text>
            
            <Text variant="titleMedium" style={styles.sectionTitle}>Colors</Text>
            <View style={styles.chipsContainer}>
              {colorOptions.map((color) => (
                <Chip
                  key={color}
                  selected={moodPreferences.colors.includes(color)}
                  onPress={() => toggleColor(color)}
                  style={styles.chip}
                >
                  {color}
                </Chip>
              ))}
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>Mood</Text>
            <View style={styles.chipsContainer}>
              {adjectiveOptions.map((adjective) => (
                <Chip
                  key={adjective}
                  selected={moodPreferences.adjectives.includes(adjective)}
                  onPress={() => toggleAdjective(adjective)}
                  style={styles.chip}
                >
                  {adjective}
                </Chip>
              ))}
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>Budget</Text>
            <View style={styles.budgetContainer}>
              {budgetOptions.map((option) => (
                <Chip
                  key={option.value}
                  selected={moodPreferences.budget === option.value}
                  onPress={() => setMoodPreferences(prev => ({
                    ...prev,
                    budget: option.value as 'low' | 'medium' | 'high'
                  }))}
                  style={[styles.budgetChip, { borderColor: option.color }]}
                >
                  {option.label}
                </Chip>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={handleAnalyze}
              style={styles.analyzeButton}
              loading={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Room'}
            </Button>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.stepTitle}>
              ✨ Analysis Complete!
            </Text>
            
            {analysis && (
              <Card style={styles.analysisCard} elevation={3}>
                <Card.Content>
                  {/* Room Type */}
                  <View style={styles.analysisRow}>
                    <Text variant="titleMedium">🏠 Room Type</Text>
                    <Text variant="bodyLarge" style={{ marginTop: 4 }}>
                      {analysis.roomType}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />

                  {/* Current Style */}
                  <View style={styles.analysisRow}>
                    <Text variant="titleMedium">🎨 Current Style</Text>
                    <Text variant="bodyLarge" style={{ marginTop: 4 }}>
                      {analysis.currentStyle}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />

                  {/* Color Scheme */}
                  <View style={styles.analysisSection}>
                    <Text variant="titleMedium">🎨 Color Scheme</Text>
                    <View style={styles.colorChips}>
                      {analysis.colorScheme.map((color, index) => (
                        <Chip key={index} style={styles.colorChip}>
                          {color}
                        </Chip>
                      ))}
                    </View>
                  </View>

                  <Divider style={styles.divider} />

                  {/* Existing Furniture */}
                  <View style={styles.analysisSection}>
                    <Text variant="titleMedium">🪑 Existing Furniture</Text>
                    <View style={styles.furnitureList}>
                      {analysis.furniture.map((item, index) => (
                        <Chip key={index} style={styles.furnitureChip}>
                          {item}
                        </Chip>
                      ))}
                    </View>
                  </View>

                  {/* Suggestions */}
                  {analysis.improvements && analysis.improvements.length > 0 && (
                    <>
                      <Divider style={styles.divider} />
                      <View style={styles.analysisSection}>
                        <Text variant="titleMedium">💡 Suggestions</Text>
                        {analysis.improvements.map((improvement, index) => (
                          <Text key={index} variant="bodyMedium" style={styles.improvement}>
                            • {improvement}
                          </Text>
                        ))}
                      </View>
                    </>
                  )}

                  {/* Confidence Score */}
                  <Divider style={styles.divider} />
                  <View style={styles.confidenceSection}>
                    <Text variant="titleMedium">Confidence Score</Text>
                    <ProgressBar
                      progress={analysis.confidence}
                      color="#7FB878"
                      style={styles.confidenceProgressBar}
                    />
                    <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                      {Math.round(analysis.confidence * 100)}%
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            )}

            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.continueButton}
              icon="arrow-right"
            >
              Get Recommendations
            </Button>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#5D8658', '#7FB878']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Room Analysis
            </Text>
            <View style={styles.placeholder} />
          </View>
          <ProgressBar
            progress={(currentStep + 1) / 4}
            color="white"
            style={styles.progressBar}
          />
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <LinearGradient
            colors={['#5D8658', '#7FB878']}
            style={styles.loadingGradient}
          >
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>AI is analyzing your space...</Text>
            <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
          </LinearGradient>
        </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 50,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 30,
  },
  stepTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#2A3B28',
  },
  stepDescription: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  dimensionsContainer: {
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.6,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F0E6',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontWeight: '600',
    color: '#2A3B28',
  },
  budgetContainer: {
    marginBottom: 30,
  },
  budgetChip: {
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  continueButton: {
    marginTop: 20,
  },
  analyzeButton: {
    marginTop: 20,
    backgroundColor: '#5D8658',
  },
  analysisCard: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E8F0E6',
  },
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
    backgroundColor: '#E8F0E6',
  },
  furnitureList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  furnitureChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F0E6',
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
  confidenceProgressBar: {
    width: '100%',
    height: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
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
  },
  loadingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
});

