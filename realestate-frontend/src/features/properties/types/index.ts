import type { ListingType, PropertyStatus, PropertyType } from "@/shared/types/enums";

export interface PropertyImageDto {
  id: string;
  imageUrl: string;
  displayOrder: number;
}

export interface PropertySummaryDto {
  id: string;
  title: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  coverImageUrl: string | null;
}

export interface PropertyDetailDto {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  images: PropertyImageDto[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
}

export interface PropertySearchRequest {
  city?: string;
  neighborhood?: string;
  zipCode?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType;
  listingType?: ListingType;
  page?: number;
  pageSize?: number;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
}

export type UpdatePropertyRequest = CreatePropertyRequest;

export interface UpdateStatusRequest {
  status: PropertyStatus;
}