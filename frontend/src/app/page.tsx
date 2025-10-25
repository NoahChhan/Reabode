"use client";

import { useState, useEffect } from "react";

interface Item {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8000";

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE}/items`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Add new item
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      setItems([...items, data]);
      setNewItem({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle item completion
  const toggleItem = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });
      const data = await response.json();
      setItems(items.map((item) => (item.id === id ? data : item)));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete item
  const deleteItem = async (id: number) => {
    try {
      await fetch(`${API_BASE}/items/${id}`, {
        method: "DELETE",
      });
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Reabode Todo App
          </h1>

          {/* Add new item form */}
          <form onSubmit={addItem} className="mb-8">
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>

          {/* Items list */}
          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No items yet. Add one above!
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.completed
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleItem(item.id, item.completed)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {item.completed && "✓"}
                    </button>
                    <div>
                      <h3
                        className={`font-medium ${
                          item.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {item.name}
                      </h3>
                      {item.description && (
                        <p
                          className={`text-sm ${
                            item.completed ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
