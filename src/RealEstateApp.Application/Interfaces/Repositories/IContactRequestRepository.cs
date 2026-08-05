using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Application.Interfaces.Repositories;

public interface IContactRequestRepository : IRepository<ContactRequest>
{
    Task<IReadOnlyList<ContactRequest>> GetByPropertyIdAsync(Guid propertyId);
}