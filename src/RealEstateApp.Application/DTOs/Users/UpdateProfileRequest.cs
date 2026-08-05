using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.DTOs.Users;

public class UpdateProfileRequest
{
    public string? Name { get; set; }
    public string? CurrentPassword { get; set; }
    public string? NewPassword { get; set; }

    // Seller profile
    public SellerType? SellerType { get; set; }
    public string? LicenseNumber { get; set; }
    public string? AgencyName { get; set; }
}