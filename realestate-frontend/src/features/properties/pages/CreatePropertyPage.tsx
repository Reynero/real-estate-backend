import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/features/users/api/userApi";
import { SellerTypeForm } from "@/features/users/components/SellerTypeForm";
import { propertyApi } from "../api/propertyApi";
import { PropertyForm, type PropertyFormValues } from "../components/PropertyForm";

export function CreatePropertyPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [needsSellerType, setNeedsSellerType] = useState<boolean | null>(null); // null = still checking

  useEffect(() => {
    userApi.getProfile().then((profile) => {
      setNeedsSellerType(profile.sellerType === null);
    });
  }, []);

  const handleSubmit = async (values: PropertyFormValues) => {
    setError(null);
    try {
      const created = await propertyApi.create(values);
      navigate(`/properties/${created.id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          err.response?.data?.title ??
          "Couldn't create the listing. Check the form and try again."
      );
      throw err;
    }
  };

  if (needsSellerType === null) {
    return <div className="p-16 text-center text-mute">Loading…</div>;
  }

  if (needsSellerType) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="font-display text-2xl text-ink">What kind of seller are you?</h1>
        <p className="mt-1 text-sm text-mute">
          Just once — this helps buyers know who they're talking to.
        </p>
        <div className="mt-6">
          <SellerTypeForm onSaved={() => setNeedsSellerType(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-2xl text-ink">List a new property</h1>
      <p className="mt-1 text-sm text-mute">
        Fill in the details below — you'll be able to add photos right after.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
      )}

      <div className="mt-6">
        <PropertyForm onSubmit={handleSubmit} submitLabel="Create listing" />
      </div>
    </div>
  );
}