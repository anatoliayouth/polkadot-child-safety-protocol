import axios, { AxiosInstance } from 'axios';
import { Child, Guardian, ActivityEntry, CreateChildFormData, AddGuardianFormData, ApiResponse } from '@types/index';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Child endpoints
  async createChild(data: CreateChildFormData): Promise<ApiResponse<Child>> {
    try {
      const response = await this.client.post<ApiResponse<Child>>('/children', data);
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to create child' };
    }
  }

  async getChildren(): Promise<ApiResponse<Child[]>> {
    try {
      const response = await this.client.get<ApiResponse<Child[]>>('/children');
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to fetch children' };
    }
  }

  async getChild(id: string): Promise<ApiResponse<Child>> {
    try {
      const response = await this.client.get<ApiResponse<Child>>(`/children/${id}`);
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to fetch child' };
    }
  }

  // Guardian endpoints
  async addGuardian(data: AddGuardianFormData): Promise<ApiResponse<Guardian>> {
    try {
      const response = await this.client.post<ApiResponse<Guardian>>('/guardians', data);
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to add guardian' };
    }
  }

  async getGuardians(childId?: string): Promise<ApiResponse<Guardian[]>> {
    try {
      const params = childId ? { childId } : undefined;
      const response = await this.client.get<ApiResponse<Guardian[]>>('/guardians', { params });
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to fetch guardians' };
    }
  }

  async removeGuardian(guardianId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.client.delete<ApiResponse<void>>(`/guardians/${guardianId}`);
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to remove guardian' };
    }
  }

  // Activity endpoints
  async getActivityLog(childId?: string): Promise<ApiResponse<ActivityEntry[]>> {
    try {
      const params = childId ? { childId } : undefined;
      const response = await this.client.get<ApiResponse<ActivityEntry[]>>('/activity', { params });
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to fetch activity log' };
    }
  }

  async logActivity(childId: string, type: string, description: string): Promise<ApiResponse<ActivityEntry>> {
    try {
      const response = await this.client.post<ApiResponse<ActivityEntry>>('/activity', {
        childId,
        type,
        description,
      });
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to log activity' };
    }
  }
}

export const apiClient = new ApiClient();
