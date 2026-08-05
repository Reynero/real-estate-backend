using MapsterMapper;
using RealEstateApp.Application.DTOs.Favorites;
using RealEstateApp.Application.Interfaces;
using RealEstateApp.Application.Interfaces.Services;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Application.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public FavoriteService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<FavoriteDto>> GetByUserIdAsync(Guid userId)
    {
        var favorites = await _unitOfWork.Favorites.GetByUserIdAsync(userId);
        return _mapper.Map<IReadOnlyList<FavoriteDto>>(favorites);
    }

    public async Task AddAsync(Guid userId, Guid propertyId)
    {
        // Guard: don't allow duplicate favorites
        var existing = await _unitOfWork.Favorites.GetAsync(userId, propertyId);
        if (existing is not null)
            return; // already favorited — treat as success, not an error

        // Guard: property must exist
        var property = await _unitOfWork.Properties.GetByIdAsync(propertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        var favorite = new Favorite
        {
            UserId     = userId,
            PropertyId = property.Id
        };

        await _unitOfWork.Favorites.AddAsync(favorite);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveAsync(Guid userId, Guid propertyId)
    {
        var favorite = await _unitOfWork.Favorites.GetAsync(userId, propertyId)
            ?? throw new KeyNotFoundException("Favorite not found.");

        _unitOfWork.Favorites.Delete(favorite);
        await _unitOfWork.SaveChangesAsync();
    }
}