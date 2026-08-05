using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Application.Interfaces.Services;

namespace RealEstateApp.API.Controllers;

[Authorize]
public class FavoritesController : BaseController
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    // GET api/favorites
    [HttpGet]
    public async Task<IActionResult> GetMyFavorites()
    {
        var favorites = await _favoriteService.GetByUserIdAsync(CurrentUserId);
        return Ok(favorites);
    }

    // POST api/favorites/{propertyId}
    [HttpPost("{propertyId:guid}")]
    public async Task<IActionResult> Add(Guid propertyId)
    {
        await _favoriteService.AddAsync(CurrentUserId, propertyId);
        return Ok();
    }

    // DELETE api/favorites/{propertyId}
    [HttpDelete("{propertyId:guid}")]
    public async Task<IActionResult> Remove(Guid propertyId)
    {
        await _favoriteService.RemoveAsync(CurrentUserId, propertyId);
        return NoContent();
    }
}