using RealEstateApp.Application.DTOs.Favorites;

namespace RealEstateApp.Application.Interfaces.Services;

public interface IFavoriteService
{
    Task<IReadOnlyList<FavoriteDto>> GetByUserIdAsync(Guid userId);
    Task AddAsync(Guid userId, Guid propertyId);
    Task RemoveAsync(Guid userId, Guid propertyId);
}