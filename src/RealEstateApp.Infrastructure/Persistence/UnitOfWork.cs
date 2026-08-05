using RealEstateApp.Application.Interfaces;
using RealEstateApp.Application.Interfaces.Repositories;
using RealEstateApp.Infrastructure.Persistence.Repositories;

namespace RealEstateApp.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IUserRepository Users { get; }
    public IPropertyRepository Properties { get; }
    public IFavoriteRepository Favorites { get; }
    public IContactRequestRepository ContactRequests { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;

        // All repositories share the same DbContext instance —
        // this is what makes SaveChangesAsync() commit everything atomically
        Users           = new UserRepository(context);
        Properties      = new PropertyRepository(context);
        Favorites       = new FavoriteRepository(context);
        ContactRequests = new ContactRequestRepository(context);
    }

    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();

    public void Dispose()
        => _context.Dispose();
}