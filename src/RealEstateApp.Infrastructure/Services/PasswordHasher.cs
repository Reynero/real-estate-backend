using RealEstateApp.Application.Interfaces.Services;

namespace RealEstateApp.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    // Work factor of 12 is the current recommended minimum for BCrypt.
    // Higher = slower to hash = harder to brute-force, but costs more CPU on login.
    private const int WorkFactor = 12;

    public string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public bool Verify(string password, string passwordHash)
        => BCrypt.Net.BCrypt.Verify(password, passwordHash);
}