const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Item {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  completed?: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
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
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Items API
  async getItems(): Promise<Item[]> {
    return this.request<Item[]>("/items");
  }

  async getItem(id: number): Promise<Item> {
    return this.request<Item>(`/items/${id}`);
  }

  async createItem(item: CreateItemRequest): Promise<Item> {
    return this.request<Item>("/items", {
      method: "POST",
      body: JSON.stringify(item),
    });
  }

  async updateItem(id: number, item: UpdateItemRequest): Promise<Item> {
    return this.request<Item>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
  }

  async deleteItem(id: number): Promise<void> {
    return this.request<void>(`/items/${id}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }
}

export const apiService = new ApiService();
