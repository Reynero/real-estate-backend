import { apiClient } from "@/shared/api/client";
import type { UpdateProfileRequest, UserProfileDto } from "../types";

export const userApi = {
  getProfile: async (): Promise<UserProfileDto> => {
    const res = await apiClient.get<UserProfileDto>("/users/me");
    return res.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileDto> => {
    const res = await apiClient.patch<UserProfileDto>("/users/me", data);
    return res.data;
  },
};