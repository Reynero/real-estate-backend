import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { ListingType, PropertyType } from "@/shared/types/enums";
import { LocationPicker } from "./LocationPicker";
import type { CreatePropertyRequest } from "../types";

export interface PropertyFormValues extends CreatePropertyRequest {}

interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  submitLabel: string;
}

export function PropertyForm({ defaultValues, onSubmit, submitLabel }: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    defaultValues: {
      propertyType: PropertyType.House,
      listingType: ListingType.ForSale,
      country: "USA",
      ...defaultValues,
    },
  });

  const latitude = watch("latitude") ?? null;
  const longitude = watch("longitude") ?? null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Title"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Description</label>
        <textarea
          rows={4}
          className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-slate"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-xs text-clay">{errors.description.message}</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Price"
          type="number"
          error={errors.price?.message}
          {...register("price", { required: "Price is required", valueAsNumber: true, min: 0 })}
        />
        <Input
          label="Area (sqft)"
          type="number"
          error={errors.area?.message}
          {...register("area", { required: "Area is required", valueAsNumber: true, min: 0 })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Bedrooms"
          type="number"
          error={errors.bedrooms?.message}
          {...register("bedrooms", { required: true, valueAsNumber: true, min: 0 })}
        />
        <Input
          label="Bathrooms"
          type="number"
          error={errors.bathrooms?.message}
          {...register("bathrooms", { required: true, valueAsNumber: true, min: 0 })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Property type</label>
          <select
            className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-slate"
            {...register("propertyType")}
          >
            <option value={PropertyType.House}>House</option>
            <option value={PropertyType.Apartment}>Apartment</option>
            <option value={PropertyType.Condo}>Condo</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Listing type</label>
          <select
            className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-slate"
            {...register("listingType")}
          >
            <option value={ListingType.ForSale}>For sale</option>
            <option value={ListingType.ForRent}>For rent</option>
          </select>
        </div>
      </div>

      <Input
        label="Street address"
        error={errors.street?.message}
        {...register("street", { required: "Street is required" })}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="City"
          error={errors.city?.message}
          {...register("city", { required: "City is required" })}
        />
        <Input
          label="State"
          error={errors.state?.message}
          {...register("state", { required: "State is required" })}
        />
        <Input
          label="Zip code"
          error={errors.zipCode?.message}
          {...register("zipCode", { required: "Zip code is required" })}
        />
      </div>

      <Input label="Country" {...register("country", { required: true })} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Location on map</label>
        <LocationPicker
          latitude={latitude}
          longitude={longitude}
          onChange={(lat, lng) => {
            setValue("latitude", lat);
            setValue("longitude", lng);
          }}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start px-8">
        {submitLabel}
      </Button>
    </form>
  );
}