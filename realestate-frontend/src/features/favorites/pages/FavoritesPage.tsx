import { useEffect } from "react";
import { useFavoriteStore } from "../store/favoriteStore";
import { FavoriteCard } from "../components/FavoriteCard";

export function FavoritesPage() {
  const { favorites, isLoaded, fetchFavorites, toggleFavorite } = useFavoriteStore();

  useEffect(() => {
    if (!isLoaded) {
      fetchFavorites();
    }
  }, [isLoaded, fetchFavorites]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="font-display text-2xl text-ink">Saved properties</h1>

      {isLoaded && favorites.length === 0 && (
        <p className="mt-8 text-center text-sm text-mute">
          You haven't saved any properties yet. Browse listings and tap the heart to save one.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.propertyId}
            favorite={favorite}
            onRemove={() => toggleFavorite(favorite.propertyId)}
          />
        ))}
      </div>
    </div>
  );
}