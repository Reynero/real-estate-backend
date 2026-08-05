import { apiClient } from "@/shared/api/client";
import type {
  CreatePropertyRequest,
  PropertyDetailDto,
  PropertySearchRequest,
  PropertySummaryDto,
  UpdatePropertyRequest,
  UpdateStatusRequest,
} from "../types";

export const propertyApi = {
  search: async (params: PropertySearchRequest): Promise<PropertySummaryDto[]> => {
    const res = await apiClient.get<PropertySummaryDto[]>("/properties", { params });
    return res.data;
  },

  getById: async (id: string): Promise<PropertyDetailDto> => {
    const res = await apiClient.get<PropertyDetailDto>(`/properties/${id}`);
    return res.data;
  },

  getMyListings: async (): Promise<PropertySummaryDto[]> => {
    const res = await apiClient.get<PropertySummaryDto[]>("/properties/my-listings");
    return res.data;
  },

  create: async (data: CreatePropertyRequest): Promise<PropertyDetailDto> => {
    const res = await apiClient.post<PropertyDetailDto>("/properties", data);
    return res.data;
  },

  update: async (id: string, data: UpdatePropertyRequest): Promise<void> => {
    await apiClient.put(`/properties/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },

  updateStatus: async (id: string, data: UpdateStatusRequest): Promise<void> => {
    await apiClient.patch(`/properties/${id}/status`, data);
  },

  uploadImage: async (id: string, file: File, displayOrder = 0): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ imageUrl: string }>(
      `/properties/${id}/images?displayOrder=${displayOrder}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  removeImage: async (id: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}/images/${imageId}`);
  },
};