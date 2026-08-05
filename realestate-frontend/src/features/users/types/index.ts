import type { SellerType } from "@/shared/types/enums";

export interface UserProfileDto {
  id: string;
  name: string;
  email: string;
  role: string;
  sellerType: SellerType | null;
  licenseNumber: string | null;
  agencyName: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  sellerType?: SellerType;
  licenseNumber?: string;
  agencyName?: string;
}