// API configuration and helper functions
const API_BASE_URL = "http://localhost:3001/categories";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: boolean;
  parentId?: string | null | { _id: string; name: string; slug: string }; // Support both populated and non-populated parentId
  childrenCount?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryListResponse {
  message: string;
  listCate: Category[];
  pagination: PaginationResponse;
}

export interface CategoryResponse {
  message: string;
  category: Category;
}

// Category API functions
export const categoryApi = {
  // Get all parent categories with pagination and search
  getParentCategories: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<CategoryListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/parents?${queryParams}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Get all subcategories with pagination and search
  getSubcategories: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<CategoryListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    queryParams.append("populate", "true");

    const response = await fetch(
      `${API_BASE_URL}/subcategories?${queryParams}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Get all categories with pagination and search
  getCategories: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
    parentId?: string;
  }): Promise<CategoryListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.parentId) queryParams.append("parentId", params.parentId);

    const response = await fetch(`${API_BASE_URL}/?${queryParams}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Get categories by parent ID with pagination and search
  getCategoriesByParent: async (
    parentId: string,
    params?: {
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<CategoryListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/by-parent/${parentId}?${queryParams}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Get category tree
  getCategoryTree: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/tree`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Create a new category
  createCategory: async (data: {
    name: string;
    description?: string;
    status?: boolean;
    parentId?: string | null;
  }): Promise<CategoryResponse> => {
    const requestBody: any = {
      name: data.name,
      description: data.description || "",
      status: data.status !== undefined ? data.status : true,
    };

    // Only include parentId if it's provided and not empty
    if (data.parentId) {
      requestBody.parentId = data.parentId;
    }

    const response = await fetch(`${API_BASE_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Update a category by slug
  updateCategory: async (
    slug: string,
    data: {
      name?: string;
      description?: string;
      status?: boolean;
      parentId?: string | null;
    }
  ): Promise<CategoryResponse> => {
    const response = await fetch(`${API_BASE_URL}/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete a category by slug (soft delete)
  deleteCategory: async (slug: string): Promise<CategoryResponse> => {
    const response = await fetch(`${API_BASE_URL}/${slug}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    return response.json();
  },
};
