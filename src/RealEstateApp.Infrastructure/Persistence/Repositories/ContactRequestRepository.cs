using Microsoft.EntityFrameworkCore;
using RealEstateApp.Application.Interfaces.Repositories;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Infrastructure.Persistence.Repositories;

public class ContactRequestRepository : Repository<ContactRequest>, IContactRequestRepository
{
    public ContactRequestRepository(AppDbContext context) : base(context) { }

    public async Task<IReadOnlyList<ContactRequest>> GetByPropertyIdAsync(Guid propertyId)
        => await _dbSet
            .Where(cr => cr.PropertyId == propertyId)
            .Include(cr => cr.Buyer)
            .Include(cr => cr.Property)
            .OrderByDescending(cr => cr.CreatedAt)
            .ToListAsync();
}