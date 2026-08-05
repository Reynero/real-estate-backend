using RealEstateApp.Application.DTOs.Users;

namespace RealEstateApp.Application.Interfaces.Services;

public interface IUserService
{
    Task<UserDto> GetByIdAsync(Guid userId);
    Task<UserDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
}