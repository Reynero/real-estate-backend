export interface ContactRequestDto {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface CreateContactRequest {
  propertyId: string;
  message: string;
}