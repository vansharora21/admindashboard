import { create } from 'zustand';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  company: {
    name: string;
    title: string;
  };
  image: string;
}

interface UserState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  cache: Record<string, { data: User[], total: number, timestamp: number }>;
  
  fetchUsers: (limit: number, skip: number, search?: string) => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},

  fetchUsers: async (limit, skip, search = '') => {
    const cacheKey = `users-${limit}-${skip}-${search}`;
    const now = Date.now();
    const cached = get().cache[cacheKey];

    // Caching Strategy: Check if data is in cache and not expired
    // Caching is useful to reduce API calls, improve perceived performance, and handle temporary network issues.
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      set({ users: cached.data, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const url = search 
        ? `https://dummyjson.com/users/search?q=${search}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        set((state) => ({
          users: data.users,
          total: data.total,
          loading: false,
          cache: {
            ...state.cache,
            [cacheKey]: { data: data.users, total: data.total, timestamp: now }
          }
        }));
      } else {
        set({ error: 'Failed to fetch users', loading: false });
      }
    } catch (err) {
      set({ error: 'An error occurred while fetching users', loading: false });
    }
  },

  getUserById: async (id) => {
    // Check if user is already in current users list
    const existingUser = get().users.find(u => u.id.toString() === id);
    if (existingUser) return existingUser;

    try {
      const res = await fetch(`https://dummyjson.com/users/${id}`);
      const data = await res.json();
      return res.ok ? data : null;
    } catch (err) {
      console.error('Error fetching user:', err);
      return null;
    }
  }
}));
