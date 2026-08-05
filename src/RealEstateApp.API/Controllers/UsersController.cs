using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Application.DTOs.Users;
using RealEstateApp.Application.Interfaces.Services;

namespace RealEstateApp.API.Controllers;

[Authorize]
public class UsersController : BaseController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // GET api/users/me
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userService.GetByIdAsync(CurrentUserId);
        return Ok(user);
    }

    // PATCH api/users/me
    [HttpPatch("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await _userService.UpdateProfileAsync(CurrentUserId, request);
        return Ok(user);
    }
}