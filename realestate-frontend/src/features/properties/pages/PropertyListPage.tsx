import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { propertyApi } from "../api/propertyApi";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyFilters } from "../components/PropertyFilters";
import { PropertyMap } from "../components/PropertyMap";
import type { PropertySearchRequest, PropertySummaryDto } from "../types";

const PAGE_SIZE = 20;

export function PropertyListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Seed the initial filters from the URL (e.g. ?listingType=ForSale coming
  // from the landing page's "Buy"/"Rent" buttons). Only read once on mount —
  // after that, filters are driven entirely by the filter bar itself.
  const initialListingType = searchParams.get("listingType") as PropertySearchRequest["listingType"] | null;
  const [initialFilters] = useState<PropertySearchRequest>(
    initialListingType ? { listingType: initialListingType } : {}
  );

  const [filters, setFilters] = useState<PropertySearchRequest>(initialFilters);
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<PropertySummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const runSearch = useCallback(async (searchFilters: PropertySearchRequest, pageNum: number) => {
    setIsLoading(true);
    try {
      const results = await propertyApi.search({ ...searchFilters, page: pageNum, pageSize: PAGE_SIZE });
      setProperties(results);
      setHasNextPage(results.length === PAGE_SIZE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(initialFilters, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (newFilters: PropertySearchRequest) => {
    setFilters(newFilters);
    setPage(1);
    runSearch(newFilters, 1);
  };

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    runSearch(filters, nextPage);
    document.getElementById("property-list-scroll")?.scrollTo({ top: 0 });
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 65px)" }}>
      <PropertyFilters onSearch={handleSearch} isLoading={isLoading} initialFilters={initialFilters} />

      <div className="flex border-b border-line bg-paper px-6 py-2 lg:hidden">
        <div className="flex rounded-lg border border-line p-0.5">
          <button
            onClick={() => setMobileView("list")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${
              mobileView === "list" ? "bg-slate text-white" : "text-ink"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setMobileView("map")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${
              mobileView === "map" ? "bg-slate text-white" : "text-ink"
            }`}
          >
            Map
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          id="property-list-scroll"
          className={`w-full flex-col overflow-y-auto px-6 py-4 lg:flex lg:w-1/2 ${
            mobileView === "list" ? "flex" : "hidden"
          }`}
        >
          {properties.length === 0 && !isLoading && (
            <p className="py-16 text-center text-sm text-mute">
              No properties match these filters yet.
            </p>
          )}

          <div className="grid flex-1 grid-cols-1 gap-4 content-start sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => navigate(`/properties/${property.id}`)}
                onHover={() => setHoveredId(property.id)}
              />
            ))}
          </div>

          {properties.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button variant="ghost" onClick={() => goToPage(page - 1)} disabled={page === 1 || isLoading}>
                ← Prev
              </Button>
              <span className="text-sm text-mute">Page {page}</span>
              <Button variant="ghost" onClick={() => goToPage(page + 1)} disabled={!hasNextPage || isLoading}>
                Next →
              </Button>
            </div>
          )}
        </div>

        <div
          className={`w-full border-line lg:flex lg:w-1/2 lg:border-l ${
            mobileView === "map" ? "block" : "hidden"
          }`}
        >
          <PropertyMap
            properties={properties}
            hoveredId={hoveredId}
            onHoverPin={setHoveredId}
            onSelectPin={(id) => navigate(`/properties/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}