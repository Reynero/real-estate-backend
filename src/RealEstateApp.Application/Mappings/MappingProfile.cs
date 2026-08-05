using Mapster;
using RealEstateApp.Application.DTOs.ContactRequests;
using RealEstateApp.Application.DTOs.Favorites;
using RealEstateApp.Application.DTOs.Properties;
using RealEstateApp.Application.DTOs.Users;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Application.Mappings;

public class MappingProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // User
        config.NewConfig<User, UserDto>()
            .Map(dest => dest.Role,       src => src.Role.ToString())
            .Map(dest => dest.SellerType, src => src.SellerType.HasValue
                ? src.SellerType.ToString()
                : null);

        // Property -> PropertySummaryDto
        config.NewConfig<Property, PropertySummaryDto>()
            .Map(dest => dest.PropertyType, src => src.PropertyType.ToString())
            .Map(dest => dest.ListingType,  src => src.ListingType.ToString())
            .Map(dest => dest.Status,        src => src.Status.ToString())
            .Map(dest => dest.CoverImageUrl, src =>
                src.Images
                   .OrderBy(i => i.DisplayOrder)
                   .Select(i => i.ImageUrl)
                   .FirstOrDefault());

        // Property -> PropertyDetailDto
        config.NewConfig<Property, PropertyDetailDto>()
            .Map(dest => dest.PropertyType,       src => src.PropertyType.ToString())
            .Map(dest => dest.ListingType,        src => src.ListingType.ToString())
            .Map(dest => dest.Status,             src => src.Status.ToString())
            .Map(dest => dest.Images,             src =>
                src.Images
                .OrderBy(i => i.DisplayOrder)
                .Select(i => new PropertyImageDto
                {
                    Id           = i.Id,
                    ImageUrl     = i.ImageUrl,
                    DisplayOrder = i.DisplayOrder
                })
                .ToList())
            .Map(dest => dest.OwnerName,          src => src.Owner.Name)
            .Map(dest => dest.OwnerEmail,         src => src.Owner.Email)
            .Map(dest => dest.OwnerSellerType,    src => src.Owner.SellerType.HasValue
                ? src.Owner.SellerType.ToString()
                : null)
            .Map(dest => dest.OwnerAgencyName,    src => src.Owner.AgencyName)
            .Map(dest => dest.OwnerLicenseNumber, src => src.Owner.LicenseNumber);

        // Favorite -> FavoriteDto
        config.NewConfig<Favorite, FavoriteDto>()
            .Map(dest => dest.PropertyId,    src => src.PropertyId)
            .Map(dest => dest.Title,         src => src.Property.Title)
            .Map(dest => dest.Price,         src => src.Property.Price)
            .Map(dest => dest.City,          src => src.Property.City)
            .Map(dest => dest.CoverImageUrl, src =>
                src.Property.Images
                   .OrderBy(i => i.DisplayOrder)
                   .Select(i => i.ImageUrl)
                   .FirstOrDefault());

        // ContactRequest -> ContactRequestDto
        config.NewConfig<ContactRequest, ContactRequestDto>()
            .Map(dest => dest.PropertyTitle, src => src.Property.Title)
            .Map(dest => dest.BuyerName,     src => src.Buyer.Name)
            .Map(dest => dest.BuyerEmail,    src => src.Buyer.Email)
            .Map(dest => dest.Status,        src => src.Status.ToString());
    }
}