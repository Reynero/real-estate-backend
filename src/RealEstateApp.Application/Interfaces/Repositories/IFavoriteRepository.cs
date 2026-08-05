using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Application.Interfaces.Repositories;

public interface IFavoriteRepository
{
    Task<Favorite?> GetAsync(Guid userId, Guid propertyId);
    Task<IReadOnlyList<Favorite>> GetByUserIdAsync(Guid userId);
    Task AddAsync(Favorite favorite);
    void Delete(Favorite favorite);
}