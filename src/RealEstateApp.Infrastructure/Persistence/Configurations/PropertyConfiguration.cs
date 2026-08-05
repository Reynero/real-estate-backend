using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Infrastructure.Persistence.Configurations;

public class PropertyConfiguration : IEntityTypeConfiguration<Property>
{
    public void Configure(EntityTypeBuilder<Property> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(4000);

        builder.Property(p => p.Price)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(p => p.PropertyType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(p => p.ListingType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);
            
        builder.Property(p => p.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(p => p.Bedrooms).IsRequired();
        builder.Property(p => p.Bathrooms).IsRequired();

        builder.Property(p => p.Area)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(p => p.Street).IsRequired().HasMaxLength(200);
        builder.Property(p => p.City).IsRequired().HasMaxLength(100);
        builder.Property(p => p.State).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Country).IsRequired().HasMaxLength(100);
        builder.Property(p => p.ZipCode).IsRequired().HasMaxLength(20);

        builder.Property(p => p.Latitude).IsRequired(false);
        builder.Property(p => p.Longitude).IsRequired(false);

        builder.Property(p => p.CreatedAt).IsRequired();
        builder.Property(p => p.UpdatedAt).IsRequired();

        // Indexes for the most common search/filter fields
        builder.HasIndex(p => p.City);
        builder.HasIndex(p => p.ZipCode);
        builder.HasIndex(p => p.Price);
        builder.HasIndex(p => p.OwnerId);

        // Relationship: Property belongs to one User (owner)
        // If the owner is deleted, their properties are deleted too (cascade)
        builder.HasOne(p => p.Owner)
            .WithMany(u => u.Properties)
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}