using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Application.DTOs.Properties;
using RealEstateApp.Application.Interfaces.Services;

namespace RealEstateApp.API.Controllers;

public class PropertiesController : BaseController
{
    private readonly IPropertyService _propertyService;
    private readonly IImageUploadService _imageUploadService;

    public PropertiesController(
        IPropertyService propertyService,
        IImageUploadService imageUploadService)
    {
        _propertyService    = propertyService;
        _imageUploadService = imageUploadService;
    }

    // GET api/properties?city=Austin&minPrice=100000&page=1
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] PropertySearchRequest request)
    {
        var properties = await _propertyService.SearchAsync(request);
        return Ok(properties);
    }

    // GET api/properties/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property is null) return NotFound();
        return Ok(property);
    }

    // GET api/properties/my-listings
    [Authorize]
    [HttpGet("my-listings")]
    public async Task<IActionResult> GetMyListings()
    {
        var properties = await _propertyService.GetByOwnerIdAsync(CurrentUserId);
        return Ok(properties);
    }

    // POST api/properties
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePropertyRequest request)
    {
        var property = await _propertyService.CreateAsync(CurrentUserId, request);

        // 201 Created with a Location header pointing to the new resource
        return CreatedAtAction(nameof(GetById), new { id = property.Id }, property);
    }

    // PUT api/properties/{id}
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePropertyRequest request)
    {
        await _propertyService.UpdateAsync(id, CurrentUserId, CurrentUserRole, request);
        return NoContent();
    }

    // DELETE api/properties/{id}
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _propertyService.DeleteAsync(id, CurrentUserId, CurrentUserRole);
        return NoContent();
    }

    // POST api/properties/{id}/images
    [Authorize]
    [HttpPost("{id:guid}/images")]
    public async Task<IActionResult> AddImage(Guid id, IFormFile file, [FromQuery] int displayOrder = 0)
    {
        var imageUrl = await _imageUploadService.UploadAsync(file);
        await _propertyService.AddImageAsync(id, CurrentUserId, imageUrl, displayOrder);
        return Ok(new { imageUrl });
    }

    // DELETE api/properties/{id}/images/{imageId}
    [Authorize]
    [HttpDelete("{id:guid}/images/{imageId:guid}")]
    public async Task<IActionResult> RemoveImage(Guid id, Guid imageId)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property is null) return NotFound();

        var image = property.Images.FirstOrDefault(i => i.Id == imageId);
        if (image is not null)
            await _imageUploadService.DeleteAsync(image.ImageUrl);

        await _propertyService.RemoveImageAsync(id, CurrentUserId, CurrentUserRole, imageId);
        return NoContent();
    }

    // PATCH api/properties/{id}/status
    [Authorize]
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        await _propertyService.UpdateStatusAsync(id, CurrentUserId, CurrentUserRole, request.Status);
        return NoContent();
    }
}