using RealEstateApp.Application.DTOs.ContactRequests;

namespace RealEstateApp.Application.Interfaces.Services;

public interface IContactRequestService
{
    Task<ContactRequestDto> CreateAsync(Guid buyerId, CreateContactRequest request);
    Task<IReadOnlyList<ContactRequestDto>> GetByPropertyIdAsync(Guid propertyId, Guid ownerId);
}