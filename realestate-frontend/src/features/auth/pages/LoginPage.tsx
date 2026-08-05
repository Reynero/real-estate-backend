import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useAuthStore } from "../store/authStore";
import type { LoginRequest } from "../types";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      navigate("/browse");
    } catch {
      // error is already surfaced via the store's `error` field
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen px-4">
      <div className="w-full max-w-sm rounded-card border border-line bg-paper p-8 shadow-sm">
        <h1 className="font-display text-3xl text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-mute">Log in to browse and save listings.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
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
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          {error && (
            <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
          )}

          <Button type="submit" isLoading={isLoading} className="mt-2 w-full" onClick={clearError}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mute">
          New here?{" "}
          <Link to="/register" className="font-medium text-slate hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}