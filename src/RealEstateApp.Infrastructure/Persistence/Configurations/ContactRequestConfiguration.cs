using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateApp.Domain.Entities;

namespace RealEstateApp.Infrastructure.Persistence.Configurations;

public class ContactRequestConfiguration : IEntityTypeConfiguration<ContactRequest>
{
    public void Configure(EntityTypeBuilder<ContactRequest> builder)
    {
        builder.HasKey(cr => cr.Id);

        builder.Property(cr => cr.Message)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(cr => cr.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(cr => cr.CreatedAt).IsRequired();

        // Same multiple-cascade-paths issue as Favorites.
        // Keep cascade on Property side, NoAction on User/Buyer side.
        builder.HasOne(cr => cr.Property)
            .WithMany(p => p.ContactRequests)
            .HasForeignKey(cr => cr.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cr => cr.Buyer)
            .WithMany(u => u.ContactRequests)
            .HasForeignKey(cr => cr.BuyerId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}