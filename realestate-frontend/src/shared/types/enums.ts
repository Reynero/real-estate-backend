// These mirror the backend enums exactly (RealEstateApp.Domain.Enums).
// Keep them in sync if the backend enum members ever change.

export const UserRole = {
  Buyer: "Buyer",
  Seller: "Seller",
  Admin: "Admin",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PropertyType = {
  House: "House",
  Apartment: "Apartment",
  Condo: "Condo",
} as const;
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export const ListingType = {
  ForSale: "ForSale",
  ForRent: "ForRent",
} as const;
export type ListingType = (typeof ListingType)[keyof typeof ListingType];

export const PropertyStatus = {
  Active: "Active",
  Sold: "Sold",
  Rented: "Rented",
  Inactive: "Inactive",
} as const;
export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];

export const ContactStatus = {
  Pending: "Pending",
  Responded: "Responded",
  Closed: "Closed",
} as const;
export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];

export const SellerType = {
  Homeowner: "Homeowner",
  Agent: "Agent",
  Other: "Other",
} as const;
export type SellerType = (typeof SellerType)[keyof typeof SellerType];