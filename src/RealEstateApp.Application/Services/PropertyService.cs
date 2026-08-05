using MapsterMapper;
using RealEstateApp.Application.DTOs.Properties;
using RealEstateApp.Application.Interfaces;
using RealEstateApp.Application.Interfaces.Services;
using RealEstateApp.Domain.Entities;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.Services;

public class PropertyService : IPropertyService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PropertyService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PropertyDetailDto?> GetByIdAsync(Guid id)
    {
        var property = await _unitOfWork.Properties.GetByIdWithDetailsAsync(id);
        return property is null ? null : _mapper.Map<PropertyDetailDto>(property);
    }

    public async Task<IReadOnlyList<PropertySummaryDto>> SearchAsync(PropertySearchRequest request)
    {
        var properties = await _unitOfWork.Properties.SearchAsync(request);
        return _mapper.Map<IReadOnlyList<PropertySummaryDto>>(properties);
    }

    public async Task<IReadOnlyList<PropertySummaryDto>> GetByOwnerIdAsync(Guid ownerId)
    {
        var properties = await _unitOfWork.Properties.GetByOwnerIdAsync(ownerId);
        return _mapper.Map<IReadOnlyList<PropertySummaryDto>>(properties);
    }

    public async Task<PropertyDetailDto> CreateAsync(Guid ownerId, CreatePropertyRequest request)
    {
        var owner = await _unitOfWork.Users.GetByIdAsync(ownerId)
            ?? throw new KeyNotFoundException("User not found.");

        // Enforce listing limits based on seller type
        var existingListings = await _unitOfWork.Properties.GetByOwnerIdAsync(ownerId);

        int limit = owner.SellerType switch
        {
            null                              => 3, // not set yet — default limit
            Domain.Enums.SellerType.Homeowner => 3,
            Domain.Enums.SellerType.Agent     => int.MaxValue,
            Domain.Enums.SellerType.Other     => 5,
            _                                 => 3  // fallback for any future values
        };

        if (existingListings.Count >= limit)
            throw new InvalidOperationException(
                $"You have reached your listing limit of {limit}. " +
                "Please upgrade your account to list more properties.");

        var property = new Property
        {
            OwnerId      = owner.Id,
            Title        = request.Title,
            Description  = request.Description,
            Price        = request.Price,
            PropertyType = request.PropertyType,
            ListingType  = request.ListingType,
            Bedrooms     = request.Bedrooms,
            Bathrooms    = request.Bathrooms,
            Area         = request.Area,
            Street       = request.Street,
            City         = request.City,
            State        = request.State,
            Country      = request.Country,
            ZipCode      = request.ZipCode,
            Latitude     = request.Latitude,
            Longitude    = request.Longitude
        };

        await _unitOfWork.Properties.AddAsync(property);
        await _unitOfWork.SaveChangesAsync();

        var created = await _unitOfWork.Properties.GetByIdWithDetailsAsync(property.Id);
        return _mapper.Map<PropertyDetailDto>(created!);
    }

    public async Task UpdateAsync(Guid propertyId, Guid ownerId, UserRole userRole, UpdatePropertyRequest request)
    {
        var property = await _unitOfWork.Properties.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        AuthorizeOwnerOrAdmin(property.OwnerId, ownerId, userRole, "edit");

        property.Title        = request.Title;
        property.Description  = request.Description;
        property.Price        = request.Price;
        property.PropertyType = request.PropertyType;
        property.ListingType  = request.ListingType;
        property.Bedrooms     = request.Bedrooms;
        property.Bathrooms    = request.Bathrooms;
        property.Area         = request.Area;
        property.Street       = request.Street;
        property.City         = request.City;
        property.State        = request.State;
        property.Country      = request.Country;
        property.ZipCode      = request.ZipCode;
        property.Latitude     = request.Latitude;
        property.Longitude    = request.Longitude;
        property.UpdatedAt    = DateTime.UtcNow;

        _unitOfWork.Properties.Update(property);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid propertyId, Guid ownerId, UserRole userRole)
    {
        var property = await _unitOfWork.Properties.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        AuthorizeOwnerOrAdmin(property.OwnerId, ownerId, userRole, "delete");

        _unitOfWork.Properties.Delete(property);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task AddImageAsync(Guid propertyId, Guid ownerId, string imageUrl, int displayOrder)
    {
        // Only load the property to verify ownership — don't touch Images collection
        var property = await _unitOfWork.Properties.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        if (property.OwnerId != ownerId)
            throw new UnauthorizedAccessException("You do not have permission to add images to this property.");

        // Insert the image directly — no concurrency conflict possible
        var image = new PropertyImage
        {
            Id           = Guid.NewGuid(),
            PropertyId   = propertyId,
            ImageUrl     = imageUrl,
            DisplayOrder = displayOrder
        };

        await _unitOfWork.Properties.AddImageAsync(image);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveImageAsync(Guid propertyId, Guid ownerId, UserRole userRole, Guid imageId)
    {
        var property = await _unitOfWork.Properties.GetByIdWithDetailsAsync(propertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        AuthorizeOwnerOrAdmin(property.OwnerId, ownerId, userRole, "remove images from");

        var image = property.Images.FirstOrDefault(i => i.Id == imageId)
            ?? throw new KeyNotFoundException("Image not found.");

        property.Images.Remove(image);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateStatusAsync(Guid propertyId, Guid ownerId, UserRole userRole, PropertyStatus status)
    {
        var property = await _unitOfWork.Properties.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        AuthorizeOwnerOrAdmin(property.OwnerId, ownerId, userRole, "update");

        property.Status    = status;
        property.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Properties.Update(property);
        await _unitOfWork.SaveChangesAsync();
    }

    private static void AuthorizeOwnerOrAdmin(Guid propertyOwnerId, Guid requestingUserId, UserRole userRole, string action)
    {
        if (userRole != UserRole.Admin && propertyOwnerId != requestingUserId)
            throw new UnauthorizedAccessException($"You do not have permission to {action} this property.");
    }
        
}