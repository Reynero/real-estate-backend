import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { SellerType } from "@/shared/types/enums";
import { userApi } from "../api/userApi";
import type { UpdateProfileRequest } from "../types";

interface FormValues {
  sellerType: SellerType;
  licenseNumber: string;
  agencyName: string;
}

interface SellerTypeFormProps {
  defaultValues?: Partial<FormValues>;
  onSaved: () => void;
  submitLabel?: string;
}

const options: { value: SellerType; label: string; blurb: string }[] = [
  { value: SellerType.Homeowner, label: "Homeowner", blurb: "I'm listing my own property" },
  { value: SellerType.Agent, label: "Real estate agent", blurb: "I list on behalf of clients" },
  { value: SellerType.Other, label: "Other", blurb: "Property manager, builder, etc." },
];

export function SellerTypeForm({ defaultValues, onSaved, submitLabel = "Continue" }: SellerTypeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { sellerType: SellerType.Homeowner, ...defaultValues },
  });

  const sellerType = watch("sellerType");

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const payload: UpdateProfileRequest = {
      sellerType: values.sellerType,
      licenseNumber: values.sellerType === SellerType.Agent ? values.licenseNumber : undefined,
      agencyName: values.agencyName || undefined,
    };
    try {
      await userApi.updateProfile(payload);
      onSaved();
    } catch (err: any) {
      setError(
        err.response?.data?.message ?? err.response?.data?.title ?? "Couldn't save. Try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setValue("sellerType", option.value)}
            className={`flex flex-col items-start gap-1 rounded-card border p-4 text-left transition-colors ${
              sellerType === option.value ? "border-slate bg-slate/5" : "border-line hover:bg-linen"
            }`}
          >
            <span className="font-medium text-ink">{option.label}</span>
            <span className="text-xs text-mute">{option.blurb}</span>
          </button>
        ))}
      </div>

      {sellerType === SellerType.Agent && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="License number"
            error={errors.licenseNumber?.message}
            {...register("licenseNumber", { required: "Required for agents" })}
          />
          <Input label="Agency name (optional)" {...register("agencyName")} />
        </div>
      )}

      {sellerType !== SellerType.Agent && (
        <Input label="Agency / company name (optional)" {...register("agencyName")} />
      )}

      {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}

      <Button type="submit" isLoading={isSubmitting} className="self-start px-8">
        {submitLabel}
      </Button>
    </form>
  );
}