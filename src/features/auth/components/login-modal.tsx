"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { applyApiErrors } from "@/lib/forms/apply-api-errors";
import { useSingleFlightMutate } from "@/lib/hooks/use-single-flight-mutate";
import { useLogin } from "../mutations";
import { type LoginValues, loginSchema } from "../schemas";
import { useAuthStore } from "../store";

function LoginForm() {
  const openModal = useAuthStore((state) => state.openModal);
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useLogin();
  const mutate = useSingleFlightMutate(mutation);
  const { isPending } = mutation;

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors, touchedFields, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    mutate(values, {
      onError: (error) => {
        const message = applyApiErrors(error, setError);
        setFormError(message);
        if (message) resetField("password");
      },
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <Input
          label="Email"
          type="email"
          data-autofocus
          autoComplete="email"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          valid={touchedFields.email && !errors.email}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          valid={touchedFields.password && !errors.password}
          {...register("password")}
        />
        {formError && (
          <p role="alert" className="-mt-2 text-label-s text-red">
            {formError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <Button
          type="submit"
          loading={isPending}
          disabled={!isValid}
          className="w-full"
        >
          Log in
        </Button>
        <p className="flex items-center justify-center gap-1.25 text-body-m text-fg-secondary">
          Don't have an account?
          <button
            type="button"
            onClick={() => openModal("register")}
            className="text-button text-red"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
}

export function LoginModal() {
  const open = useAuthStore((state) => state.modal === "login");
  const closeModal = useAuthStore((state) => state.closeModal);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Log in"
      description="Welcome back to Kino XII"
      className="w-[403px]"
    >
      <LoginForm />
    </Modal>
  );
}
