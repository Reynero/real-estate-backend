using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.DTOs.Properties;

public class PropertySearchRequest
{
    public string? City { get; set; }
    public string? Neighborhood { get; set; }
    public string? ZipCode { get; set; }
    public string? Address { get; set; }

    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int? Bedrooms { get; set; }
    public int? Bathrooms { get; set; }
    public PropertyType? PropertyType { get; set; }
    public ListingType? ListingType { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}