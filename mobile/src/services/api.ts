import { 
  RoomImage, 
  RoomDimensions, 
  MoodPreferences, 
  RoomAnalysis, 
  ProductRecommendation, 
  DesignProject 
} from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
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
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }

  // Room Analysis
  async analyzeRoom(
    images: RoomImage[],
    dimensions: RoomDimensions,
    moodPreferences: MoodPreferences
  ): Promise<RoomAnalysis> {
    return this.request<RoomAnalysis>('/analyze-room', {
      method: 'POST',
      body: JSON.stringify({
        images,
        dimensions,
        moodPreferences,
      }),
    });
  }

  // Product Recommendations
  async getRecommendations(
    analysis: RoomAnalysis,
    budget: string,
    style: string[]
  ): Promise<ProductRecommendation[]> {
    return this.request<ProductRecommendation[]>('/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        analysis,
        budget,
        style,
      }),
    });
  }

  // Design Projects
  async createProject(project: Omit<DesignProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<DesignProject> {
    return this.request<DesignProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async getProjects(): Promise<DesignProject[]> {
    return this.request<DesignProject[]>('/projects');
  }

  async getProject(id: string): Promise<DesignProject> {
    return this.request<DesignProject>(`/projects/${id}`);
  }

  async updateProject(id: string, updates: Partial<DesignProject>): Promise<DesignProject> {
    return this.request<DesignProject>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Product Search
  async searchProducts(query: string, filters?: {
    category?: string;
    priceRange?: [number, number];
    style?: string[];
  }): Promise<ProductRecommendation[]> {
    return this.request<ProductRecommendation[]>('/products/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        filters,
      }),
    });
  }

  // Mood Board
  async createMoodBoard(
    images: string[],
    style: string,
    colors: string[]
  ): Promise<{ id: string; url: string }> {
    return this.request<{ id: string; url: string }>('/mood-board', {
      method: 'POST',
      body: JSON.stringify({
        images,
        style,
        colors,
      }),
    });
  }

  // Real-time collaboration
  async joinRoom(roomId: string): Promise<{ token: string; url: string }> {
    return this.request<{ token: string; url: string }>('/collaboration/join', {
      method: 'POST',
      body: JSON.stringify({ roomId }),
    });
  }
}

export const apiService = new ApiService();
