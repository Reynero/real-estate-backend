using RealEstateApp.Domain.Common;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Property> Properties { get; set; } = new List<Property>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<ContactRequest> ContactRequests { get; set; } = new List<ContactRequest>();

    // Seller profile — only set when user intends to list properties
    public SellerType? SellerType { get; set; }
    public string? LicenseNumber { get; set; }
    public string? AgencyName { get; set; }
}