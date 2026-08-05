namespace RealEstateApp.Application.DTOs.Properties;

public class PropertyImageDto
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}