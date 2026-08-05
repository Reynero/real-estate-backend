using RealEstateApp.Application.DTOs.Auth;
using RealEstateApp.Application.Interfaces;
using RealEstateApp.Application.Interfaces.Services;
using RealEstateApp.Domain.Entities;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // 1. Guard: reject duplicate emails
        bool emailTaken = await _unitOfWork.Users.EmailExistsAsync(request.Email);
        if (emailTaken)
            throw new InvalidOperationException("An account with this email already exists.");

        // 2. Build the entity — role defaults to Buyer, password is hashed, never stored plain
        var user = new User
        {
            Name         = request.Name,
            Email        = request.Email.ToLowerInvariant(),
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role         = UserRole.User
        };

        // 3. Persist
        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // 4. Return a token immediately so the user is logged in right after registering
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // 1. Look up by email (case-insensitive)
        var user = await _unitOfWork.Users.GetByEmailAsync(request.Email.ToLowerInvariant());

        // 2. We use the same generic error for "not found" and "wrong password"
        //    — never tell an attacker which one it was
        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return BuildAuthResponse(user);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private AuthResponse BuildAuthResponse(User user) => new()
    {
        Token  = _jwtTokenGenerator.GenerateToken(user),
        UserId = user.Id,
        Name   = user.Name,
        Email  = user.Email,
        Role   = user.Role.ToString()
    };
}