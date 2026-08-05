using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Domain.Entities;

public class Favorite
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}