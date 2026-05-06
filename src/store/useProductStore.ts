import { create } from 'zustand';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductState {
  products: Product[];
  categories: string[];
  total: number;
  loading: boolean;
  error: string | null;
  cache: Record<string, { data: Product[], total: number, timestamp: number }>;
  
  fetchProducts: (limit: number, skip: number, search?: string, category?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
}

const CACHE_DURATION = 5 * 60 * 1000;

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},

  fetchProducts: async (limit, skip, search = '', category = '') => {
    const cacheKey = `products-${limit}-${skip}-${search}-${category}`;
    const now = Date.now();
    const cached = get().cache[cacheKey];

    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      set({ products: cached.data, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      let url = '';
      if (search) {
        url = `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`;
      } else if (category && category !== 'all') {
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        set((state) => ({
          products: data.products,
          total: data.total,
          loading: false,
          cache: {
            ...state.cache,
            [cacheKey]: { data: data.products, total: data.total, timestamp: now }
          }
        }));
      } else {
        set({ error: 'Failed to fetch products', loading: false });
      }
    } catch (err) {
      set({ error: 'An error occurred while fetching products', loading: false });
    }
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    try {
      const res = await fetch('https://dummyjson.com/products/categories');
      const data = await res.json();
      // DummyJSON categories can be objects or strings depending on version
      const categories = Array.isArray(data) ? data.map(c => typeof c === 'object' ? c.slug : c) : [];
      set({ categories });
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  },

  getProductById: async (id) => {
    const existing = get().products.find(p => p.id.toString() === id);
    if (existing) return existing;

    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await res.json();
      return res.ok ? data : null;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  }
}));
