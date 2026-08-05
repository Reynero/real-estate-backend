import { apiClient } from "@/shared/api/client";
import type { ContactRequestDto, CreateContactRequest } from "../types";

export const contactApi = {
  create: async (data: CreateContactRequest): Promise<ContactRequestDto> => {
    const res = await apiClient.post<ContactRequestDto>("/contactrequests", data);
    return res.data;
  },

  getForProperty: async (propertyId: string): Promise<ContactRequestDto[]> => {
    const res = await apiClient.get<ContactRequestDto[]>(`/contactrequests/property/${propertyId}`);
    return res.data;
  },
};