using RealEstateApp.Application.DTOs.Properties;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.Interfaces.Services;

public interface IPropertyService
{
    Task<PropertyDetailDto?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<PropertySummaryDto>> SearchAsync(PropertySearchRequest request);
    Task<IReadOnlyList<PropertySummaryDto>> GetByOwnerIdAsync(Guid ownerId);

    Task<PropertyDetailDto> CreateAsync(Guid ownerId, CreatePropertyRequest request);
    Task UpdateAsync(Guid propertyId, Guid ownerId, UserRole userRole, UpdatePropertyRequest request);
    Task DeleteAsync(Guid propertyId, Guid ownerId, UserRole userRole);
    Task UpdateStatusAsync(Guid propertyId, Guid ownerId, UserRole userRole, PropertyStatus status);

    Task AddImageAsync(Guid propertyId, Guid ownerId, string imageUrl, int displayOrder);
    Task RemoveImageAsync(Guid propertyId, Guid ownerId, UserRole userRole, Guid imageId);
}