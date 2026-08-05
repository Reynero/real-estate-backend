using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Infrastructure.Persistence.Configurations;

public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
{
    public void Configure(EntityTypeBuilder<Favorite> builder)
    {
        // Composite primary key — the combination of UserId + PropertyId is unique
        builder.HasKey(f => new { f.UserId, f.PropertyId });

        builder.Property(f => f.CreatedAt).IsRequired();

        builder.HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Use NoAction here to avoid a SQL Server multiple cascade paths error.
        // SQL Server does not allow two cascade delete paths to the same table.
        // Since Property already cascades to Favorites via PropertyConfiguration,
        // we use NoAction on this side and handle cleanup manually if needed.
        builder.HasOne(f => f.Property)
            .WithMany(p => p.FavoritedBy)
            .HasForeignKey(f => f.PropertyId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}