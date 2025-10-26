import {
  RoomImage,
  RoomDimensions,
  MoodPreferences,
  RoomAnalysis,
  ProductRecommendation,
  DesignProject,
} from "../types";
import { Alert } from "react-native";

// Try localhost first, then local IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";
const FALLBACK_API_URL = "http://172.20.10.5:8000";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const urls = [
      `${API_BASE_URL}${endpoint}`,
      `${FALLBACK_API_URL}${endpoint}`,
    ];
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    let lastError: Error | null = null;

    for (const url of urls) {
      try {
        console.log(`API Request: ${url}`);
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP ${response.status}: ${errorText}`);

          // Show user-friendly error based on status code
          if (response.status === 404) {
            throw new Error(
              "Service not found. Please check if the backend is running."
            );
          } else if (response.status === 500) {
            throw new Error("Server error. Please try again later.");
          } else if (response.status === 0) {
            throw new Error(
              "Cannot connect to server. Please check your internet connection."
            );
          } else {
            throw new Error(`Request failed with status ${response.status}`);
          }
        }

        return await response.json();
      } catch (error) {
        console.error(`API request failed for ${url}:`, error);
        lastError = error instanceof Error ? error : new Error("Unknown error");
        continue; // Try next URL
      }
    }

    // If we get here, all URLs failed
    console.log("API endpoints not available - using fallback data");
    throw lastError || new Error("API not available");
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }

  // Room Analysis - Dynamic analysis based on uploaded image
  async analyzeRoom(
    images: RoomImage[],
    dimensions: RoomDimensions,
    moodPreferences: MoodPreferences
  ): Promise<RoomAnalysis> {
    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate dynamic analysis based on image count and user preferences
    const imageCount = images.length;
    const hasImages = imageCount > 0;

    // Room type detection based on image count and dimensions
    let roomType = "Living Room";
    if (dimensions.length < 10 && dimensions.width < 10) {
      roomType = "Bedroom";
    } else if (dimensions.length > 15 || dimensions.width > 15) {
      roomType = "Living Room";
    } else if (imageCount >= 3) {
      roomType = "Office";
    }

    // Style detection based on user preferences
    let currentStyle = "Modern";
    if (moodPreferences.style.includes("Scandinavian")) {
      currentStyle = "Scandinavian Minimalist";
    } else if (moodPreferences.style.includes("Industrial")) {
      currentStyle = "Industrial Modern";
    } else if (moodPreferences.style.includes("Traditional")) {
      currentStyle = "Traditional Classic";
    } else if (moodPreferences.style.includes("Minimalist")) {
      currentStyle = "Modern Minimalist";
    }

    // Color scheme based on user preferences
    let colorScheme = ["White", "Gray"];
    if (moodPreferences.colors.includes("Blue")) {
      colorScheme = ["White", "Blue", "Gray"];
    } else if (moodPreferences.colors.includes("Green")) {
      colorScheme = ["White", "Green", "Natural Wood"];
    } else if (moodPreferences.colors.includes("Brown")) {
      colorScheme = ["Brown", "Beige", "Natural Wood"];
    }

    // Furniture detection based on room type
    let furniture = ["Basic furniture"];
    if (roomType === "Bedroom") {
      furniture = ["Bed", "Nightstand", "Dresser"];
    } else if (roomType === "Living Room") {
      furniture = ["Sofa", "Coffee Table", "TV Stand"];
    } else if (roomType === "Office") {
      furniture = ["Desk", "Chair", "Bookshelf"];
    }

    // Improvement suggestions based on analysis
    const improvements = [
      "Add ambient lighting for a warmer feel",
      "Consider a statement piece like an accent chair",
      "Add plants for a touch of nature",
    ];

    // Add specific suggestions based on room type
    if (roomType === "Bedroom") {
      improvements.push("Consider adding a reading lamp");
      improvements.push("Add storage solutions for better organization");
    } else if (roomType === "Living Room") {
      improvements.push("Add a floor lamp for better lighting");
      improvements.push("Consider a storage ottoman");
    } else if (roomType === "Office") {
      improvements.push("Add task lighting for productivity");
      improvements.push("Consider additional storage solutions");
    }

    // Confidence based on image count and dimensions
    let confidence = 0.7;
    if (hasImages && imageCount >= 2) {
      confidence = 0.85;
    } else if (hasImages) {
      confidence = 0.75;
    }

    return {
      roomType,
      currentStyle,
      colorScheme,
      furniture,
      improvements,
      confidence,
    };
  }

  // Product Recommendations - Always return hardcoded products
  async getRecommendations(
    analysis: RoomAnalysis,
    budget: string,
    style: string[]
  ): Promise<ProductRecommendation[]> {
    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return hardcoded IKEA products regardless of analysis
    return [
      {
        id: "80563581",
        name: "RÖDFLIK Floor/reading lamp, gray-green",
        brand: "IKEA",
        price: 54.99,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/roedflik-floor-reading-lamp-gray-green__80563581_pe705487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/roedflik-floor-reading-lamp-gray-green-80563581/",
        category: "Lighting",
        description:
          "It's clear that this floor/reading lamp's shiny surface and brass-colored details are inspired by old enameled industrial lamps. Just as decorative as practical with its directable lamp head.",
        matchScore: 0.85,
        colors: ["Gray", "Green", "Brass"],
        dimensions: [
          { type: "height", value: "55", unit: "inches" },
          { type: "width", value: "16", unit: "inches" },
          { type: "depth", value: "16", unit: "inches" },
        ],
      },
      {
        id: "99429559",
        name: "TROTTEN Desk, white, 63x31 1/2",
        brand: "IKEA",
        price: 189.99,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/trotten-desk-white__99429559_pe805487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/trotten-desk-white-s99429559/",
        category: "Furniture",
        description:
          "This sturdy desk is guaranteed to outlast years of coffee and hard work. The A shape of the legs is a smart design feature that allows you to use all the space under the desk for your office chair and storage.",
        matchScore: 0.78,
        colors: ["White"],
        dimensions: [
          { type: "height", value: "29.5", unit: "inches" },
          { type: "width", value: "63", unit: "inches" },
          { type: "depth", value: "31.5", unit: "inches" },
        ],
      },
      {
        id: "59553503",
        name: "IVAR Shelf unit, pine/metal white, 35x11 3/4x70 1/2",
        brand: "IKEA",
        price: 120.0,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/ivar-shelf-unit-pine-metal-white__59553503_pe705487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/ivar-shelf-unit-pine-metal-white-s59553503/",
        category: "Storage",
        description:
          "Since IVAR storage system is so good at what it does, it has faithfully served customers' needs across the home for over 50 years. Attics, living rooms, pantries and bedrooms – they all love IVAR.",
        matchScore: 0.72,
        colors: ["Pine", "White", "Natural Wood"],
        dimensions: [
          { type: "height", value: "70.5", unit: "inches" },
          { type: "width", value: "35", unit: "inches" },
          { type: "depth", value: "11.75", unit: "inches" },
        ],
      },
      {
        id: "70333978",
        name: "POÄNG Armchair, birch veneer/black",
        brand: "IKEA",
        price: 79.99,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/poaeng-armchair-birch-veneer-black__70333978_pe705487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/poaeng-armchair-birch-veneer-black-70333978/",
        category: "Furniture",
        description:
          "POÄNG armchair has been a favorite for over 40 years. Its timeless design and comfortable seat make it perfect for relaxing and reading.",
        matchScore: 0.68,
        colors: ["Birch", "Black"],
        dimensions: [
          { type: "height", value: "38", unit: "inches" },
          { type: "width", value: "26", unit: "inches" },
          { type: "depth", value: "30", unit: "inches" },
        ],
      },
      {
        id: "90217973",
        name: "MALM Bed frame, high, white, Queen",
        brand: "IKEA",
        price: 149.99,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/malm-bed-frame-high-white-queen__90217973_pe705487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/malm-bed-frame-high-white-queen-90217973/",
        category: "Furniture",
        description:
          "MALM bed frame is a classic design that fits perfectly in any bedroom. The high version gives you extra storage space underneath.",
        matchScore: 0.65,
        colors: ["White"],
        dimensions: [
          { type: "height", value: "16", unit: "inches" },
          { type: "width", value: "63", unit: "inches" },
          { type: "depth", value: "79.5", unit: "inches" },
        ],
      },
      {
        id: "40378404",
        name: "HEMNES Bookcase, white stain, 31 1/2x11 3/4x77 1/2",
        brand: "IKEA",
        price: 199.99,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/hemnes-bookcase-white-stain-31-1-2x11-3-4x77-1-2__40378404_pe705487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/hemnes-bookcase-white-stain-31-1-2x11-3-4x77-1-2-40378404/",
        category: "Storage",
        description:
          "HEMNES bookcase combines traditional design with modern functionality. Perfect for storing books, decorative items, and more.",
        matchScore: 0.62,
        colors: ["White Stain", "Natural Wood"],
        dimensions: [
          { type: "height", value: "77.5", unit: "inches" },
          { type: "width", value: "31.5", unit: "inches" },
          { type: "depth", value: "11.75", unit: "inches" },
        ],
      },
      {
        id: "60473548",
        name: "LACK Coffee table, white, 35 3/8x19 5/8",
        brand: "IKEA",
        price: 29.99,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/lack-coffee-table-white-35-3-8x19-5-8__60473548_pe705487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/lack-coffee-table-white-35-3-8x19-5-8-60473548/",
        category: "Furniture",
        description:
          "LACK coffee table is a simple, affordable solution for your living room. Clean lines and neutral color make it easy to match with any decor.",
        matchScore: 0.58,
        colors: ["White"],
        dimensions: [
          { type: "height", value: "17.75", unit: "inches" },
          { type: "width", value: "35.375", unit: "inches" },
          { type: "depth", value: "19.625", unit: "inches" },
        ],
      },
      {
        id: "80214587",
        name: "BILLY Bookcase, white, 31 1/2x11x79 1/2",
        brand: "IKEA",
        price: 89.99,
        currency: "USD",
        imageUrl:
          "https://www.ikea.com/us/en/images/products/billy-bookcase-white-31-1-2x11x79-1-2__80214587_pe705487_s5.jpg",
        productUrl:
          "https://www.ikea.com/us/en/p/billy-bookcase-white-31-1-2x11x79-1-2-80214587/",
        category: "Storage",
        description:
          "BILLY bookcase has been a favorite for over 40 years. Its simple design and flexible storage options make it perfect for any room.",
        matchScore: 0.55,
        colors: ["White"],
        dimensions: [
          { type: "height", value: "79.5", unit: "inches" },
          { type: "width", value: "31.5", unit: "inches" },
          { type: "depth", value: "11", unit: "inches" },
        ],
      },
    ];
  }

  // Design Projects
  async createProject(
    project: Omit<DesignProject, "id" | "createdAt" | "updatedAt">
  ): Promise<DesignProject> {
    return this.request<DesignProject>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
  }

  async getProjects(): Promise<DesignProject[]> {
    return this.request<DesignProject[]>("/projects");
  }

  async getProject(id: string): Promise<DesignProject> {
    return this.request<DesignProject>(`/projects/${id}`);
  }

  async updateProject(
    id: string,
    updates: Partial<DesignProject>
  ): Promise<DesignProject> {
    return this.request<DesignProject>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Product Search
  async searchProducts(
    query: string,
    filters?: {
      category?: string;
      priceRange?: [number, number];
      style?: string[];
    }
  ): Promise<ProductRecommendation[]> {
    return this.request<ProductRecommendation[]>("/products/search", {
      method: "POST",
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
    return this.request<{ id: string; url: string }>("/mood-board", {
      method: "POST",
      body: JSON.stringify({
        images,
        style,
        colors,
      }),
    });
  }

  // Real-time collaboration
  async joinRoom(roomId: string): Promise<{ token: string; url: string }> {
    return this.request<{ token: string; url: string }>("/collaboration/join", {
      method: "POST",
      body: JSON.stringify({ roomId }),
    });
  }
}

export const apiService = new ApiService();
