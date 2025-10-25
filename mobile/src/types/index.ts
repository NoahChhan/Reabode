export interface RoomImage {
  id: string;
  uri: string;
  base64?: string;
  timestamp: number;
}

export interface RoomDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'feet' | 'meters';
}

export interface MoodPreferences {
  style: string[];
  colors: string[];
  budget: 'low' | 'medium' | 'high';
  adjectives: string[];
}

export interface RoomAnalysis {
  roomType: string;
  currentStyle: string;
  colorScheme: string[];
  furniture: string[];
  improvements: string[];
  confidence: number;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  category: string;
  style: string;
  colors: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  matchScore: number;
  description: string;
}

export interface DesignProject {
  id: string;
  name: string;
  roomImages: RoomImage[];
  dimensions: RoomDimensions;
  moodPreferences: MoodPreferences;
  analysis: RoomAnalysis;
  recommendations: ProductRecommendation[];
  createdAt: number;
  updatedAt: number;
}

