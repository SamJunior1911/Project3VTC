// API configuration and helper functions for Products
const PRODUCT_API_BASE_URL = "http://localhost:3001/api/products";
const ASSETS_API_BASE_URL = "http://localhost:3001/api/assets";

export interface Product {
  _id: string;
  category_id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  discount?: number;
  quantity: number;
  sold?: number;
  author: string;
  status: "active" | "inactive"; // More specific type definition
  is_feature: boolean;
  deleted_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductResponse {
  message: string;
  product: Product;
  assets?: any[];
  attributes?: any[];
}

export interface Asset {
  _id: string;
  product_id: string;
  file_name: string;
  path: string;
  type: string;
  size: number;
  created_at: string;
}

// Product API functions
export const productApi = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${PRODUCT_API_BASE_URL}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Create a new product
  createProduct: async (data: FormData): Promise<ProductResponse> => {
    // Backend expects files with field name "files" via upload.array("files", 10)
    const response = await fetch(`${PRODUCT_API_BASE_URL}`, {
      method: "POST",
      body: data, // FormData automatically sets correct Content-Type with boundary
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Update a product by slug
  updateProduct: async (
    slug: string,
    data: FormData
  ): Promise<ProductResponse> => {
    // Backend uses PUT /:slug for updates
    const response = await fetch(`${PRODUCT_API_BASE_URL}/${slug}`, {
      method: "PUT",
      body: data,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete a product by slug
  deleteProduct: async (slug: string): Promise<{ message: string }> => {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/${slug}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Decrease stock for products
  decreaseStock: async (
    items: Array<{ product_id: string; quantity: number }>
  ) => {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/decrease-stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(items),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return response.json();
  },

  getProductAssets: async (productId: string): Promise<Asset[]> => {
    const response = await fetch(`${ASSETS_API_BASE_URL}/${productId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },
};
