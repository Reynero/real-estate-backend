import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { ListingType, PropertyType } from "@/shared/types/enums";
import type { PropertySearchRequest } from "../types";

interface PropertyFiltersProps {
  onSearch: (filters: PropertySearchRequest) => void;
  isLoading?: boolean;
  initialFilters?: PropertySearchRequest;
}

export function PropertyFilters({ onSearch, isLoading, initialFilters }: PropertyFiltersProps) {
  const [city, setCity] = useState(initialFilters?.city ?? "");
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice?.toString() ?? "");
  const [bedrooms, setBedrooms] = useState(initialFilters?.bedrooms?.toString() ?? "");
  const [listingType, setListingType] = useState<string>(initialFilters?.listingType ?? "");
  const [propertyType, setPropertyType] = useState<string>(initialFilters?.propertyType ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      city: city || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      listingType: (listingType || undefined) as PropertySearchRequest["listingType"],
      propertyType: (propertyType || undefined) as PropertySearchRequest["propertyType"],
      page: 1,
      pageSize: 20,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 border-b border-line bg-paper px-6 py-4"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mute">City</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Austin"
          className="w-32 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-slate"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mute">Min price</label>
        <input
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          type="number"
          placeholder="0"
          className="w-28 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-slate"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mute">Max price</label>
        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          type="number"
          placeholder="Any"
          className="w-28 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-slate"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mute">Bedrooms</label>
        <input
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          type="number"
          placeholder="Any"
          className="w-20 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-slate"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mute">Listing type</label>
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-slate"
        >
          <option value="">Any</option>
          <option value={ListingType.ForSale}>For sale</option>
          <option value={ListingType.ForRent}>For rent</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mute">Property type</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-slate"
        >
          <option value="">Any</option>
          <option value={PropertyType.House}>House</option>
          <option value={PropertyType.Apartment}>Apartment</option>
          <option value={PropertyType.Condo}>Condo</option>
        </select>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Search
      </Button>
    </form>
  );
}