import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { contactApi } from "@/features/contact/api/contactApi";
import type { CreateContactRequest } from "@/features/contact/types";
import { useFavoriteStore } from "@/features/favorites/store/favoriteStore";
import { Button } from "@/shared/components/Button";
import { propertyApi } from "../api/propertyApi";
import { ImageCarousel } from "../components/ImageCarousel";
import { PropertyMap } from "../components/PropertyMap";
import type { PropertyDetailDto, PropertySummaryDto } from "../types";

function formatPrice(price: number, listingType: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === "ForRent" ? `${formatted}/mo` : formatted;
}

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { favoritedIds, isLoaded, fetchFavorites, toggleFavorite } = useFavoriteStore();

  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ message: string }>();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    propertyApi
      .getById(id)
      .then(setProperty)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && !isLoaded) {
      fetchFavorites();
    }
  }, [isAuthenticated, isLoaded, fetchFavorites]);

  const onSubmitContact = async (data: { message: string }) => {
    if (!property) return;
    const payload: CreateContactRequest = { propertyId: property.id, message: data.message };
    await contactApi.create(payload);
    setContactSent(true);
    reset();
  };

  const reloadProperty = () => {
    if (!id) return;
    propertyApi.getById(id).then(setProperty);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !property) return;

    setIsUploading(true);
    try {
      await propertyApi.uploadImage(property.id, file, property.images.length);
      reloadProperty();
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return <div className="p-16 text-center text-mute">Loading property…</div>;
  }

  if (notFound || !property) {
    return (
      <div className="flex flex-col items-center gap-4 p-16 text-center">
        <p className="text-mute">This property couldn't be found.</p>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Back to listings
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === property.ownerId;
  const isFavorited = favoritedIds.has(property.id);

  // Reuse PropertyMap (built for the grid) by shaping this one property
  // into the same summary type it expects — avoids a second map component.
  const asSummary: PropertySummaryDto = {
    id: property.id,
    title: property.title,
    price: property.price,
    propertyType: property.propertyType as PropertySummaryDto["propertyType"],
    listingType: property.listingType as PropertySummaryDto["listingType"],
    status: property.status as PropertySummaryDto["status"],
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    city: property.city,
    state: property.state,
    latitude: property.latitude,
    longitude: property.longitude,
    coverImageUrl: property.images[0]?.imageUrl ?? null,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-mute hover:text-slate">
        ← Back
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: photos + details */}
        <div className="lg:col-span-2">
          <ImageCarousel
            images={property.images.map((img) => img.imageUrl)}
            alt={property.title}
            emptyStateButton={
              isOwner
                ? {
                    label: isUploading ? "Uploading…" : "Add photos",
                    onClick: () => fileInputRef.current?.click(),
                  }
                : undefined
            }
          />
          {isOwner && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelected}
                className="hidden"
              />
              {property.images.length > 0 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="mt-2 text-sm font-medium text-slate hover:underline disabled:opacity-60"
                >
                  {isUploading ? "Uploading…" : "+ Add another photo"}
                </button>
              )}
            </>
          )}

          <div className="mt-6 flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl text-ink">
                {formatPrice(property.price, property.listingType)}
              </h1>
              <p className="mt-1 text-ink">
                {property.bedrooms} bd · {property.bathrooms} ba · {property.area.toLocaleString()} sqft
              </p>
              <p className="text-mute">
                {property.street}, {property.city}, {property.state} {property.zipCode}
              </p>
            </div>

            {isAuthenticated && !isOwner && (
              <button
                onClick={() => toggleFavorite(property.id)}
                aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isFavorited ? "border-clay bg-clay/10 text-clay" : "border-line text-ink hover:bg-linen"
                }`}
              >
                {isFavorited ? "♥ Saved" : "♡ Save"}
              </button>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-ink">{property.description}</p>

          <div className="mt-8 h-72 overflow-hidden rounded-card border border-line">
            <PropertyMap
              properties={[asSummary]}
              hoveredId={null}
              onHoverPin={() => {}}
              onSelectPin={() => {}}
            />
          </div>
        </div>

        {/* Right: owner + contact form */}
        <div className="flex flex-col gap-4 rounded-card border border-line bg-paper p-5 h-fit">
          <div>
            <p className="text-sm text-mute">Listed by</p>
            <p className="font-medium text-ink">{property.ownerName}</p>
            <p className="text-sm text-mute">{property.ownerEmail}</p>
          </div>

          {isOwner ? (
            <p className="rounded-lg bg-linen px-3 py-2 text-sm text-mute">
              This is your own listing.
            </p>
          ) : !isAuthenticated ? (
            <p className="text-sm text-mute">
              <button onClick={() => navigate("/login")} className="font-medium text-slate hover:underline">
                Log in
              </button>{" "}
              to contact the seller.
            </p>
          ) : contactSent ? (
            <p className="rounded-lg bg-sage/10 px-3 py-2 text-sm text-sage">
              Message sent! The owner will reach out to your email.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmitContact)} className="flex flex-col gap-3">
              <label className="text-sm font-medium text-ink">Contact seller</label>
              <textarea
                rows={4}
                placeholder="Hi, I'm interested in this property…"
                className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-slate"
                {...register("message", { required: "Write a short message" })}
              />
              {errors.message && <span className="text-xs text-clay">{errors.message.message}</span>}
              <Button type="submit" isLoading={isSubmitting}>
                Send message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}