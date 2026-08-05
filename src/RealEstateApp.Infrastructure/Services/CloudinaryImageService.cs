using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using RealEstateApp.Application.Interfaces.Services;

namespace RealEstateApp.Infrastructure.Services;

public class CloudinaryImageService : IImageUploadService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryImageService(IConfiguration configuration)
    {
        var cloudinarySettings = configuration.GetSection("CloudinarySettings");

        var account = new Account(
            cloudinarySettings["CloudName"]!,
            cloudinarySettings["ApiKey"]!,
            cloudinarySettings["ApiSecret"]!
        );

        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true; // always use HTTPS URLs
    }

    public async Task<string> UploadAsync(IFormFile file)
    {
        if (file.Length == 0)
            throw new ArgumentException("File is empty.");

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File           = new FileDescription(file.FileName, stream),
            Folder         = "real-estate-app",        // organizes uploads in Cloudinary dashboard
            Transformation = new Transformation()
                .Quality("auto")                       // auto-optimize image quality
                .FetchFormat("auto")                   // serve WebP to browsers that support it
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error is not null)
            throw new InvalidOperationException($"Image upload failed: {result.Error.Message}");

        return result.SecureUrl.ToString();
    }

    public async Task DeleteAsync(string imageUrl)
    {
        // Extract the public ID from the Cloudinary URL to delete it.
        // Cloudinary URLs look like: https://res.cloudinary.com/{cloud}/image/upload/v123/{folder}/{publicId}.jpg
        var uri       = new Uri(imageUrl);
        var segments  = uri.AbsolutePath.Split('/');
        var uploadIdx = Array.IndexOf(segments, "upload");

        if (uploadIdx < 0 || uploadIdx + 2 >= segments.Length)
            throw new ArgumentException("Invalid Cloudinary URL format.");

        // Skip the version segment (e.g. "v1234567890") then join the rest
        var publicIdWithExtension = string.Join("/", segments.Skip(uploadIdx + 2));
        var publicId = Path.ChangeExtension(publicIdWithExtension, null); // strip file extension

        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}