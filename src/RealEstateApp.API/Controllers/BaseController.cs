using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Domain.Enums;

namespace RealEstateApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(claim))
                throw new UnauthorizedAccessException("User is not authenticated.");

            return Guid.Parse(claim);
        }
    }

    protected UserRole CurrentUserRole
    {
        get
        {
            var roleClaim = User.FindFirstValue(ClaimTypes.Role);
            return Enum.TryParse<UserRole>(roleClaim, out var role) ? role : UserRole.User;
        }
    }
}