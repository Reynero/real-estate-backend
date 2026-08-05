using RealEstateApp.Application.Interfaces.Repositories;

namespace RealEstateApp.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IPropertyRepository Properties { get; }
    IFavoriteRepository Favorites { get; }
    IContactRequestRepository ContactRequests { get; }

    Task<int> SaveChangesAsync();
}