using MapsterMapper;
using RealEstateApp.Application.DTOs.ContactRequests;
using RealEstateApp.Application.Interfaces;
using RealEstateApp.Application.Interfaces.Services;
using RealEstateApp.Domain.Entities;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.Services;

public class ContactRequestService : IContactRequestService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ContactRequestService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ContactRequestDto> CreateAsync(Guid buyerId, CreateContactRequest request)
    {
        // Verify both buyer and property exist
        var buyer = await _unitOfWork.Users.GetByIdAsync(buyerId)
            ?? throw new KeyNotFoundException("User not found.");

        var property = await _unitOfWork.Properties.GetByIdAsync(request.PropertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        // A buyer should not contact themselves about their own listing
        if (property.OwnerId == buyerId)
            throw new InvalidOperationException("You cannot send a contact request to your own listing.");

        var contactRequest = new ContactRequest
        {
            PropertyId = property.Id,
            BuyerId    = buyer.Id,
            Message    = request.Message,
            Status     = ContactStatus.Pending
        };

        await _unitOfWork.ContactRequests.AddAsync(contactRequest);
        await _unitOfWork.SaveChangesAsync();

        // Re-fetch with details so buyer and property names are populated
        var created = await _unitOfWork.ContactRequests.GetByIdAsync(contactRequest.Id)
            ?? throw new InvalidOperationException("Failed to retrieve created contact request.");

        return _mapper.Map<ContactRequestDto>(created);
    }

    public async Task<IReadOnlyList<ContactRequestDto>> GetByPropertyIdAsync(Guid propertyId, Guid ownerId)
    {
        // Verify the requesting user actually owns the property
        var property = await _unitOfWork.Properties.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        if (property.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You do not have permission to view these contact requests.");

        var requests = await _unitOfWork.ContactRequests.GetByPropertyIdAsync(propertyId);
        return _mapper.Map<IReadOnlyList<ContactRequestDto>>(requests);
    }
}