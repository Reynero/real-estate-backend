using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Application.Interfaces.Services;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}