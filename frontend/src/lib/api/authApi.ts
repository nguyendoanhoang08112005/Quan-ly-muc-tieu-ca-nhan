import axios from 'axios';
import { LoginData, RegisterData, AuthResponse, UpdateProfileData, User } from '../../types/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const API_V1_PREFIX = '/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post(`${API_V1_PREFIX}/auth/register`, data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post(`${API_V1_PREFIX}/auth/login`, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post(`${API_V1_PREFIX}/auth/logout`);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get(`${API_V1_PREFIX}/auth/me`);
    return response.data?.data ?? response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.patch(`${API_V1_PREFIX}/profile`, data);
    return response.data?.user ?? response.data;
  },
};

export default api;
