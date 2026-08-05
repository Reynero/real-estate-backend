import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { PropertyStatus } from "@/shared/types/enums";
import { propertyApi } from "../api/propertyApi";
import type { PropertySummaryDto } from "../types";
import { useNavigate } from "react-router-dom";

function formatPrice(price: number, listingType: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === "ForRent" ? `${formatted}/mo` : formatted;
}

export function MyListingsPage() {
  const [listings, setListings] = useState<PropertySummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadListings = () => {
    setIsLoading(true);
    propertyApi.getMyListings().then((data) => {
      setListings(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleStatusChange = async (propertyId: string, status: string) => {
    // Optimistic update — flip the badge instantly, then confirm with the server.
    setListings((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: status as PropertySummaryDto["status"] } : p))
    );
    await propertyApi.updateStatus(propertyId, { status: status as PropertySummaryDto["status"] });
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    await propertyApi.delete(propertyId);
    setListings((prev) => prev.filter((p) => p.id !== propertyId));
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">My listings</h1>
        <Link to="/my-listings/new">
          <Button variant="secondary">+ New listing</Button>
        </Link>
      </div>

      {!isLoading && listings.length === 0 && (
        <p className="mt-8 text-center text-sm text-mute">
          You haven't listed any properties yet.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {listings.map((property) => (
          <div
            key={property.id}
            className="flex items-center gap-4 rounded-card border border-line bg-paper p-4"
          >
            <button
              onClick={() => navigate(`/properties/${property.id}`)}
              className="h-16 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-line"
            >
              {property.coverImageUrl && (
                <img
                  src={property.coverImageUrl}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              )}
            </button>

            <button
              onClick={() => navigate(`/properties/${property.id}`)}
              className="flex-1 cursor-pointer text-left"
            >
              <p className="font-medium text-ink">{property.title}</p>
              <p className="text-sm text-mute">
                {formatPrice(property.price, property.listingType)} · {property.city}, {property.state}
              </p>
            </button>

            <select
              value={property.status}
              onChange={(e) => handleStatusChange(property.id, e.target.value)}
              className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-slate"
            >
              <option value={PropertyStatus.Active}>Active</option>
              <option value={PropertyStatus.Sold}>Sold</option>
              <option value={PropertyStatus.Rented}>Rented</option>
              <option value={PropertyStatus.Inactive}>Inactive</option>
            </select>

            <Link
              to={`/my-listings/${property.id}/inquiries`}
              className="text-sm font-medium text-slate hover:underline"
            >
              Inquiries
            </Link>
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