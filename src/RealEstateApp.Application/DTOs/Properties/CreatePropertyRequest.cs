using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.DTOs.Properties;

public class CreatePropertyRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public PropertyType PropertyType { get; set; }
    public ListingType ListingType { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public decimal Area { get; set; }

    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}