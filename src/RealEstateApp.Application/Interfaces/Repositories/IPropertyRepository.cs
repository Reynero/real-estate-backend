using RealEstateApp.Application.DTOs.Properties;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Application.Interfaces.Repositories;

public interface IPropertyRepository : IRepository<Property>
{
    Task<Property?> GetByIdWithDetailsAsync(Guid id);
    Task<IReadOnlyList<Property>> SearchAsync(PropertySearchRequest request);
    Task<IReadOnlyList<Property>> GetByOwnerIdAsync(Guid ownerId);
    Task AddImageAsync(PropertyImage image);  // new
} 