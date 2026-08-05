import { apiClient } from "@/shared/api/client";
import type { FavoriteDto } from "../types";

export const favoriteApi = {
  getAll: async (): Promise<FavoriteDto[]> => {
    const res = await apiClient.get<FavoriteDto[]>("/favorites");
    return res.data;
  },

  add: async (propertyId: string): Promise<void> => {
    await apiClient.post(`/favorites/${propertyId}`);
  },

  remove: async (propertyId: string): Promise<void> => {
    await apiClient.delete(`/favorites/${propertyId}`);
  },
};