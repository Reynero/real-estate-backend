using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .IsRequired();

        builder.Property(u => u.Role)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(u => u.CreatedAt)
            .IsRequired();

            // Seller profile fields — all optional
        builder.Property(u => u.SellerType)
            .IsRequired(false)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(u => u.LicenseNumber)
            .IsRequired(false)
            .HasMaxLength(100);

        builder.Property(u => u.AgencyName)
            .IsRequired(false)
            .HasMaxLength(200);
    }
}