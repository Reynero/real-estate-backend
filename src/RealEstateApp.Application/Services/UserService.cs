using Mapster;
using RealEstateApp.Application.DTOs.Users;
using RealEstateApp.Application.Interfaces;
using RealEstateApp.Application.Interfaces.Services;

namespace RealEstateApp.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDto> GetByIdAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        return user.Adapt<UserDto>();
    }

     public async Task<UserDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        // Update name if provided
        if (!string.IsNullOrWhiteSpace(request.Name))
            user.Name = request.Name;

        // Update password if provided
        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            if (string.IsNullOrWhiteSpace(request.CurrentPassword))
                throw new InvalidOperationException("Current password is required to set a new password.");

            if (!_passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Current password is incorrect.");

            user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        }

        // Update seller profile if provided
        if (request.SellerType.HasValue)
            user.SellerType = request.SellerType;

        if (request.SellerType.HasValue && request.SellerType.Value
            != Domain.Enums.SellerType.Agent)
        {
            // Clear agent-specific fields if switching away from Agent
            user.LicenseNumber = null;
            user.AgencyName    = null;
        }

        if (!string.IsNullOrWhiteSpace(request.LicenseNumber))
            user.LicenseNumber = request.LicenseNumber;

        if (!string.IsNullOrWhiteSpace(request.AgencyName))
            user.AgencyName = request.AgencyName;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return user.Adapt<UserDto>();
    }
}