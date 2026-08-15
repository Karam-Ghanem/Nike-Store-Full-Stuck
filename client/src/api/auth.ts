import { apiRequest } from './client';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

interface LoginResponse {
  token: string;
  user_id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export const authApi = {
  register: (payload: { username: string; email: string; password: string }) => apiRequest<AuthUser>('/auth/register/', {
    method: 'POST',
    authenticated: false,
    body: JSON.stringify(payload),
  }),
  login: (username: string, password: string) => apiRequest<LoginResponse>('/auth/login/', {
    method: 'POST',
    authenticated: false,
    body: JSON.stringify({ username, password }),
  }),
  currentUser: () => apiRequest<AuthUser>('/auth/user/'),
  logout: () => apiRequest<void>('/auth/logout/', { method: 'POST' }),
};
