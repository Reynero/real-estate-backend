import { create } from "zustand";
import { favoriteApi } from "../api/favoriteApi";
import type { FavoriteDto } from "../types";

interface FavoriteState {
  favorites: FavoriteDto[];
  favoritedIds: Set<string>;
  isLoaded: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  favoritedIds: new Set(),
  isLoaded: false,

  fetchFavorites: async () => {
    const favorites = await favoriteApi.getAll();
    set({
      favorites,
      favoritedIds: new Set(favorites.map((f) => f.propertyId)),
      isLoaded: true,
    });
  },

 toggleFavorite: async (propertyId: string) => {
    const isFavorited = get().favoritedIds.has(propertyId);

    // Optimistic update — flip the UI instantly, then confirm with the server.
    set((state) => {
      const next = new Set(state.favoritedIds);
      isFavorited ? next.delete(propertyId) : next.add(propertyId);
      return { favoritedIds: next };
    });

    try {
      if (isFavorited) {
        await favoriteApi.remove(propertyId);
        // Also drop it from the favorites list so the Saved page updates immediately.
        set((state) => ({
          favorites: state.favorites.filter((f) => f.propertyId !== propertyId),
        }));
      } else {
        await favoriteApi.add(propertyId);
        // We only have the propertyId here, not the full FavoriteDto (title, price, etc.),
        // so re-fetch the list to get the complete, correct data.
        await get().fetchFavorites();
      }
    } catch {
      // Revert on failure — request didn't go through, so undo the optimistic flip.
      set((state) => {
        const next = new Set(state.favoritedIds);
        isFavorited ? next.add(propertyId) : next.delete(propertyId);
        return { favoritedIds: next };
      });
    }
  },
}));