using Microsoft.EntityFrameworkCore;
using RealEstateApp.Application.Interfaces.Repositories;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Infrastructure.Persistence.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly AppDbContext _context;

    public FavoriteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Favorite?> GetAsync(Guid userId, Guid propertyId)
        => await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);

    public async Task<IReadOnlyList<Favorite>> GetByUserIdAsync(Guid userId)
        => await _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.Property)
                .ThenInclude(p => p.Images.OrderBy(i => i.DisplayOrder))
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();

    public async Task AddAsync(Favorite favorite)
        => await _context.Favorites.AddAsync(favorite);

    public void Delete(Favorite favorite)
        => _context.Favorites.Remove(favorite);
}