import { create } from 'zustand';

import { authApi, type AuthUser } from '@/api/auth';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/api/client';

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  initialized: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (username: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const storedUser = (() => {
  try {
    const raw = localStorage.getItem('nike_store_user');
    return raw ? JSON.parse(raw) as AuthUser : null;
  } catch {
    return null;
  }
})();

function persistUser(user: AuthUser | null) {
  if (user) localStorage.setItem('nike_store_user', JSON.stringify(user));
  else localStorage.removeItem('nike_store_user');
}

const useAuthStore = create<AuthStore>((set) => ({
  user: storedUser,
  isLoading: false,
  initialized: false,

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(username, password);
      setAccessToken(response.token);
      const user: AuthUser = {
        id: response.user_id,
        username: response.username,
        email: response.email,
        is_staff: response.is_staff,
      };
      persistUser(user);
      set({ user, initialized: true });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      await authApi.register({ username, email, password });
      const response = await authApi.login(username, password);
      setAccessToken(response.token);
      const user: AuthUser = {
        id: response.user_id,
        username: response.username,
        email: response.email,
        is_staff: response.is_staff,
      };
      persistUser(user);
      set({ user, initialized: true });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      if (getAccessToken()) {
        try {
          await authApi.logout();
        } catch {
          // The local session must still be cleared if a token is already invalid.
        }
      }
    } finally {
      clearAccessToken();
      persistUser(null);
      set({ user: null, isLoading: false, initialized: true });
    }
  },

  initialize: async () => {
    if (!getAccessToken()) {
      set({ user: null, initialized: true });
      return;
    }
    set({ isLoading: true });
    try {
      const user = await authApi.currentUser();
      persistUser(user);
      set({ user, initialized: true });
    } catch {
      clearAccessToken();
      persistUser(null);
      set({ user: null, initialized: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
