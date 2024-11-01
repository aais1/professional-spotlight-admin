// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      login: (token) => set({ isAuthenticated: true, token }),
      logout: () => set({ isAuthenticated: false, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);