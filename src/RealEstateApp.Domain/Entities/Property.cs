using RealEstateApp.Domain.Common;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Domain.Entities;

public class Property : BaseEntity
{
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }

    public PropertyType PropertyType { get; set; }
    public ListingType ListingType { get; set; }
    public PropertyStatus Status { get; set; } = PropertyStatus.Active;

    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public decimal Area { get; set; } // square footage

    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;

    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
    public ICollection<Favorite> FavoritedBy { get; set; } = new List<Favorite>();
    public ICollection<ContactRequest> ContactRequests { get; set; } = new List<ContactRequest>();
}