import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyApi } from "../api/propertyApi";
import type { PropertySummaryDto } from "../types";

function formatPrice(price: number, listingType: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === "ForRent" ? `${formatted}/mo` : formatted;
}

export function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertySummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = () => {
    setIsLoading(true);
    // No owner filter here — this is the same /properties search endpoint
    // everyone uses, just called with no filters to see the full catalog.
    propertyApi.search({ page: 1, pageSize: 100 }).then((data) => {
      setProperties(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    await propertyApi.delete(propertyId);
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="font-display text-2xl text-ink">All properties</h1>
      <p className="mt-1 text-sm text-mute">Admin view — every listing on the platform.</p>

      {!isLoading && properties.length === 0 && (
        <p className="mt-8 text-center text-sm text-mute">No properties yet.</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex items-center gap-4 rounded-card border border-line bg-paper p-4"
          >
            <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-line">
              {property.coverImageUrl && (
                <img
                  src={property.coverImageUrl}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-ink">{property.title}</p>
              <p className="text-sm text-mute">
                {formatPrice(property.price, property.listingType)} · {property.city}, {property.state} ·{" "}
                {property.status}
              </p>
            </div>

            <Link
              to={`/my-listings/${property.id}/edit`}
              className="text-sm font-medium text-slate hover:underline"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(property.id)}
              className="text-sm font-medium text-clay hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}