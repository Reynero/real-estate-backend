import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useAuthStore } from "../store/authStore";
import type { RegisterRequest } from "../types";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await registerUser(data);
      navigate("/browse");
    } catch {
      // error surfaced via store
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen px-4 py-10">
      <div className="w-full max-w-sm rounded-card border border-line bg-paper p-8 shadow-sm">
        <h1 className="font-display text-3xl text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-mute">Buy, rent, or list a home — all in one place.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />

          {error && (
            <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
          )}

          <Button type="submit" isLoading={isLoading} className="mt-2 w-full" onClick={clearError}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mute">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-slate hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}