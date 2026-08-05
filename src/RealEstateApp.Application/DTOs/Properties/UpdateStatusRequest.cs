using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.DTOs.Properties;

public class UpdateStatusRequest
{
    public PropertyStatus Status { get; set; }
}