namespace RealEstateApp.Application.DTOs.Users;

public class UserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? SellerType { get; set; }
    public string? LicenseNumber { get; set; }
    public string? AgencyName { get; set; }
    public DateTime CreatedAt { get; set; }
}