using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using RealEstateApp.Application.Interfaces.Services;
using RealEstateApp.Application.Mappings;
using RealEstateApp.Application.Services;

namespace RealEstateApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Mapster configuration
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(typeof(MappingProfile).Assembly);
        services.AddSingleton(config);
        services.AddScoped<IMapper, ServiceMapper>();

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPropertyService, PropertyService>();
        services.AddScoped<IFavoriteService, FavoriteService>();
        services.AddScoped<IContactRequestService, ContactRequestService>();
        services.AddScoped<IUserService, UserService>();

        return services;
    }
}