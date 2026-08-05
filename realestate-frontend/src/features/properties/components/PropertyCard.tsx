import type { PropertySummaryDto } from "../types";

const statusStyles: Record<string, string> = {
  Active: "bg-sage text-white",
  Sold: "bg-clay text-white",
  Rented: "bg-clay text-white",
  Inactive: "bg-mute text-white",
};

function formatPrice(price: number, listingType: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === "ForRent" ? `${formatted}/mo` : formatted;
}

interface PropertyCardProps {
  property: PropertySummaryDto;
  onClick?: () => void;
  onHover?: () => void;
}

export function PropertyCard({ property, onClick, onHover }: PropertyCardProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className="flex w-full flex-col overflow-hidden rounded-card border border-line bg-paper text-left transition-shadow hover:shadow-md"
    >
      <div className="relative h-44 w-full bg-line">
        {property.coverImageUrl ? (
          <img
            src={property.coverImageUrl}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-mute">
            No photo yet
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            statusStyles[property.status] ?? "bg-mute text-white"
          }`}
        >
          {property.status}
        </span>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <span className="font-display text-xl text-ink">
          {formatPrice(property.price, property.listingType)}
        </span>
        <span className="text-sm text-ink">
          {property.bedrooms} bd · {property.bathrooms} ba · {property.area.toLocaleString()} sqft
        </span>
        <span className="truncate text-sm text-mute">{property.title}</span>
        <span className="text-sm text-mute">
          {property.city}, {property.state}
        </span>
      </div>
    </button>
  );
}