import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { propertyApi } from "../api/propertyApi";
import { ImageUploader } from "../components/ImageUploader";
import { PropertyForm, type PropertyFormValues } from "../components/PropertyForm";
import type { PropertyDetailDto } from "../types";

export function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProperty = () => {
    if (!id) return;
    propertyApi.getById(id).then((data) => {
      setProperty(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values: PropertyFormValues) => {
    if (!id) return;
    setError(null);
    try {
      await propertyApi.update(id, values);
      navigate("/my-listings");
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          err.response?.data?.title ??
          "Couldn't save changes. Check the form and try again."
      );
      throw err;
    }
  };

  if (isLoading || !property) {
    return <div className="p-16 text-center text-mute">Loading listing…</div>;
  }

  const defaultValues: Partial<PropertyFormValues> = {
    title: property.title,
    description: property.description,
    price: property.price,
    propertyType: property.propertyType,
    listingType: property.listingType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    street: property.street,
    city: property.city,
    state: property.state,
    country: property.country,
    zipCode: property.zipCode,
    latitude: property.latitude,
    longitude: property.longitude,
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-2xl text-ink">Edit listing</h1>

      <div className="mt-6">
        <ImageUploader
          propertyId={property.id}
          images={property.images}
          onImagesChanged={loadProperty}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
      )}

      <div className="mt-8 border-t border-line pt-8">
        <PropertyForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}