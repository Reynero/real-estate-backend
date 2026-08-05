import { useNavigate } from "react-router-dom";
import type { FavoriteDto } from "../types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

interface FavoriteCardProps {
  favorite: FavoriteDto;
  onRemove: () => void;
}

export function FavoriteCard({ favorite, onRemove }: FavoriteCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex overflow-hidden rounded-card border border-line bg-paper">
      <button
        onClick={() => navigate(`/properties/${favorite.propertyId}`)}
        className="h-32 w-40 flex-shrink-0 bg-line"
      >
        {favorite.coverImageUrl ? (
          <img
            src={favorite.coverImageUrl}
            alt={favorite.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-mute">
            No photo
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col justify-between p-4">
        <button
          onClick={() => navigate(`/properties/${favorite.propertyId}`)}
          className="text-left"
        >
          <p className="font-display text-lg text-ink">{formatPrice(favorite.price)}</p>
          <p className="truncate text-sm text-ink">{favorite.title}</p>
          <p className="text-sm text-mute">{favorite.city}</p>
        </button>

        <button
          onClick={onRemove}
          className="self-start text-sm font-medium text-clay hover:underline"
        >
          Remove from saved
        </button>
      </div>
    </div>
  );
}