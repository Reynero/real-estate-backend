using Microsoft.AspNetCore.Http;

namespace RealEstateApp.Application.Interfaces.Services;

public interface IImageUploadService
{
    Task<string> UploadAsync(IFormFile file);
    Task DeleteAsync(string imageUrl);
}