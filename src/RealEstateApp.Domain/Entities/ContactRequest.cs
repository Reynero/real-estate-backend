using RealEstateApp.Domain.Common;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Domain.Entities;

public class ContactRequest : BaseEntity
{
    public Guid PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    public Guid BuyerId { get; set; }
    public User Buyer { get; set; } = null!;

    public string Message { get; set; } = string.Empty;
    public ContactStatus Status { get; set; } = ContactStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}