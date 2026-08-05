import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { userApi } from "../api/userApi";
import { SellerTypeForm } from "../components/SellerTypeForm";
import type { UpdateProfileRequest, UserProfileDto } from "../types";

interface FormValues {
  name: string;
  currentPassword: string;
  newPassword: string;
}

export function AccountSettingsPage() {
  const { user, updateUserName } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userApi.getProfile().then(setProfile);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: user?.name ?? "", currentPassword: "", newPassword: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSuccessMessage(null);
    setError(null);

    const payload: UpdateProfileRequest = {};
    if (values.name && values.name !== user?.name) payload.name = values.name;
    if (values.newPassword) {
      payload.newPassword = values.newPassword;
      payload.currentPassword = values.currentPassword;
    }

    if (!payload.name && !payload.newPassword) {
      setError("Change something before saving.");
      return;
    }

    try {
      const updated = await userApi.updateProfile(payload);
      updateUserName(updated.name);
      setProfile(updated);
      setSuccessMessage("Profile updated.");
      reset({ name: updated.name, currentPassword: "", newPassword: "" });
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          err.response?.data?.title ??
          "Couldn't update your profile. Check your current password and try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-8">
      <h1 className="font-display text-2xl text-ink">Account settings</h1>

      <div className="mt-2 text-sm text-mute">
        <p>{user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <Input label="Name" {...register("name", { required: "Name can't be empty" })} error={errors.name?.message} />

        <div className="mt-2 border-t border-line pt-4">
          <p className="mb-3 text-sm font-medium text-ink">Change password (optional)</p>
          <div className="flex flex-col gap-3">
            <Input label="Current password" type="password" {...register("currentPassword")} />
            <Input
              label="New password"
              type="password"
              {...register("newPassword", {
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              error={errors.newPassword?.message}
            />
          </div>
        </div>

        {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
        {successMessage && (
          <p className="rounded-lg bg-sage/10 px-3 py-2 text-sm text-sage">{successMessage}</p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start px-8">
          Save changes
        </Button>
      </form>

      <div className="mt-8 border-t border-line pt-6">
        <h2 className="text-sm font-medium text-ink">Seller profile</h2>
        <p className="mt-1 text-sm text-mute">Shown to buyers when you list a property.</p>
        <div className="mt-4">
          {profile ? (
            <SellerTypeForm
              defaultValues={{
                sellerType: profile.sellerType ?? undefined,
                licenseNumber: profile.licenseNumber ?? undefined,
                agencyName: profile.agencyName ?? undefined,
              }}
              onSaved={() => {
                setSuccessMessage("Seller profile updated.");
                userApi.getProfile().then(setProfile);
              }}
              submitLabel="Save"
            />
          ) : (
            <p className="text-sm text-mute">Loading…</p>
          )}
        </div>
      </div>
    </div>
  );
}