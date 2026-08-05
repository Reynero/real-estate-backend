namespace RealEstateApp.Application.DTOs.Favorites;

public class FavoriteDto
{
    public Guid PropertyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string City { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}