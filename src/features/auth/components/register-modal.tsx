"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { applyApiErrors } from "@/lib/forms/apply-api-errors";
import { useSingleFlightMutate } from "@/lib/hooks/use-single-flight-mutate";
import { useRegister } from "../mutations";
import { type RegisterValues, registerSchema } from "../schemas";
import { useAuthStore } from "../store";
import { AvatarUpload } from "./avatar-upload";

function RegisterForm() {
  const openModal = useAuthStore((state) => state.openModal);
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useRegister();
  const mutate = useSingleFlightMutate(mutation);
  const { isPending } = mutation;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors, touchedFields, isValid },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(
    ({ username, email, password, confirmPassword, avatar }) => {
      setFormError(null);
      mutate(
        {
          username,
          email,
          password,
          passwordConfirmation: confirmPassword,
          avatar,
        },
        {
          onError: (error) =>
            setFormError(
              applyApiErrors(error, setError, {
                password_confirmation: "confirmPassword",
              }),
            ),
        },
      );
    },
  );

  const status = (name: keyof RegisterValues) =>
    touchedFields[name] && !errors[name];

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <AvatarUpload
        value={watch("avatar")}
        error={errors.avatar?.message}
        onChange={(file) =>
          setValue("avatar", file, { shouldValidate: true, shouldDirty: true })
        }
      />

      <div className="flex flex-col gap-6">
        <Input
          label="Username"
          data-autofocus
          autoComplete="username"
          placeholder="User"
          error={errors.username?.message}
          valid={status("username")}
          {...register("username")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          valid={status("email")}
          {...register("email")}
        />
        <div className="grid gap-x-3 gap-y-6 sm:grid-cols-2">
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            valid={status("password")}
            {...register("password", {
              onChange: () => {
                if (getValues("confirmPassword"))
                  void trigger("confirmPassword");
              },
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            valid={status("confirmPassword")}
            {...register("confirmPassword")}
          />
        </div>
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
          Sign up
        </Button>
        <p className="flex items-center justify-center gap-1.25 text-body-m text-fg-secondary">
          Already have an account?
          <button
            type="button"
            onClick={() => openModal("login")}
            className="text-button text-red"
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  );
}

export function RegisterModal() {
  const open = useAuthStore((state) => state.modal === "register");
  const closeModal = useAuthStore((state) => state.closeModal);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Sign up"
      description="Welcome to Kino XII"
      className="w-[475px]"
    >
      <RegisterForm />
    </Modal>
  );
}
