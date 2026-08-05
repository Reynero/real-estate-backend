using Microsoft.EntityFrameworkCore;
using RealEstateApp.Application.DTOs.Properties;
using RealEstateApp.Application.Interfaces.Repositories;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Infrastructure.Persistence.Repositories;

public class PropertyRepository : Repository<Property>, IPropertyRepository
{
    public PropertyRepository(AppDbContext context) : base(context) { }

    public async Task<Property?> GetByIdWithDetailsAsync(Guid id)
        => await _dbSet
            .Include(p => p.Owner)
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<IReadOnlyList<Property>> GetByOwnerIdAsync(Guid ownerId)
        => await _dbSet
            .Where(p => p.OwnerId == ownerId)
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    
    public async Task AddImageAsync(PropertyImage image)
    => await _context.PropertyImages.AddAsync(image);//new

    public async Task<IReadOnlyList<Property>> SearchAsync(PropertySearchRequest request)
    {
        var query = _dbSet
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .AsQueryable();

        // Search filters — each one only applied when a value was provided
        if (!string.IsNullOrWhiteSpace(request.City))
            query = query.Where(p => p.City.ToLower().Contains(request.City.ToLower()));

        if (!string.IsNullOrWhiteSpace(request.ZipCode))
            query = query.Where(p => p.ZipCode == request.ZipCode);

        if (!string.IsNullOrWhiteSpace(request.Address))
            query = query.Where(p => p.Street.ToLower().Contains(request.Address.ToLower()));

        if (!string.IsNullOrWhiteSpace(request.Neighborhood))
            query = query.Where(p => p.City.ToLower().Contains(request.Neighborhood.ToLower()));

        // Price range filters
        if (request.MinPrice.HasValue)
            query = query.Where(p => p.Price >= request.MinPrice.Value);

        if (request.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= request.MaxPrice.Value);

        // Exact match filters
        if (request.Bedrooms.HasValue)
            query = query.Where(p => p.Bedrooms >= request.Bedrooms.Value);

        if (request.Bathrooms.HasValue)
            query = query.Where(p => p.Bathrooms >= request.Bathrooms.Value);

        if (request.PropertyType.HasValue)
            query = query.Where(p => p.PropertyType == request.PropertyType.Value);

        if (request.ListingType.HasValue)
            query = query.Where(p => p.ListingType == request.ListingType.Value);

        // Always sort newest first, then paginate
        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();
    }
}