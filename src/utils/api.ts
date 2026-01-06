import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIResponse } from '../models';

const API_BASE_URL = 'https://api.whear.app'; // Mock base URL

class MockAPIAdapter {
  private delay(min: number, max: number): Promise<void> {
    const delayMs = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private shouldError(): boolean {
    return Math.random() < 0.1; // 10% chance of error
  }

  async get<T>(url: string, config?: any): Promise<{ data: APIResponse<T> }> {
    await this.delay(300, 800);
    
    if (this.shouldError()) {
      throw new Error('Network error: Please check your connection');
    }

    // Return mock data based on endpoint
    const mockData = this.getMockDataForEndpoint<T>(url);
    return { data: { data: mockData } as APIResponse<T> };
  }

  async post<T>(url: string, data?: any, config?: any): Promise<{ data: APIResponse<T> }> {
    await this.delay(300, 800);
    
    if (this.shouldError()) {
      throw new Error('Network error: Please check your connection');
    }

    const mockData = this.getMockDataForEndpoint<T>(url, data);
    return { data: { data: mockData, message: 'Success' } as APIResponse<T> };
  }

  async put<T>(url: string, data?: any, config?: any): Promise<{ data: APIResponse<T> }> {
    await this.delay(300, 800);
    
    if (this.shouldError()) {
      throw new Error('Network error: Please check your connection');
    }

    const mockData = this.getMockDataForEndpoint<T>(url, data);
    return { data: { data: mockData, message: 'Updated successfully' } as APIResponse<T> };
  }

  async delete<T>(url: string, config?: any): Promise<{ data: APIResponse<T> }> {
    await this.delay(300, 800);
    
    if (this.shouldError()) {
      throw new Error('Network error: Please check your connection');
    }

    return { data: { data: {} as T, message: 'Deleted successfully' } as APIResponse<T> };
  }

  private getMockDataForEndpoint<T>(url: string, requestData?: any): T {
    // This will be handled by individual services
    return {} as T;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Replace axios adapter with mock
(apiClient as any).adapter = new MockAPIAdapter();

// Request interceptor for auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  }
);




