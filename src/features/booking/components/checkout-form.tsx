"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { applyApiErrors } from "@/lib/forms/apply-api-errors";
import {
  digitsOnly,
  formatCardNumber,
  formatCvv,
  formatExpiry,
  formatMobileNumber,
  normalizeMobileNumber,
} from "@/lib/forms/masks";
import type { OrderInput } from "../api";
import { type CheckoutValues, checkoutSchema } from "../schemas";

export const CHECKOUT_FORM_ID = "checkout-form";

interface CheckoutFormProps {
  defaults: { fullName: string; email: string; mobileNumber: string };
  onSubmit: (
    input: Omit<OrderInput, "holdId">,
    onError: (error: unknown) => void,
  ) => void;
  onValidChange: (valid: boolean) => void;
}

type FieldName = keyof CheckoutValues;

export function CheckoutForm({
  defaults,
  onSubmit,
  onValidChange,
}: CheckoutFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: defaults.fullName,
      email: defaults.email,
      mobileNumber: formatMobileNumber(
        normalizeMobileNumber(defaults.mobileNumber),
      ),
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  useEffect(() => onValidChange(isValid), [isValid, onValidChange]);

  const field = (name: FieldName, format?: (value: string) => string) => {
    const registration = register(name);
    const value = watch(name);

    return {
      ...registration,
      error: errors[name]?.message,
      valid:
        !errors[name] &&
        value !== "" &&
        checkoutSchema.shape[name].safeParse(value).success,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        if (format) event.target.value = format(event.target.value);
        return registration.onChange(event);
      },
    };
  };

  const submit = handleSubmit((values) => {
    setFormError(null);
    onSubmit(
      {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        mobileNumber: digitsOnly(values.mobileNumber),
        cardNumber: digitsOnly(values.cardNumber),
        expiry: values.expiry,
        cvv: values.cvv,
      },
      (error) => setFormError(applyApiErrors(error, setError)),
    );
  });

  return (
    <form
      id={CHECKOUT_FORM_ID}
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-6"
    >
      <Input
        label="Full name"
        placeholder="e.g. Jane Doe"
        autoComplete="name"
        {...field("fullName")}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          placeholder="e.g. jane@example.com"
          autoComplete="email"
          {...field("email")}
        />
        <Input
          label="Mobile number"
          inputMode="numeric"
          placeholder="e.g. 555 123 456"
          autoComplete="tel-national"
          {...field("mobileNumber", formatMobileNumber)}
        />
      </div>

      <hr className="h-px border-0 bg-card" />

      <Input
        label="Card number"
        inputMode="numeric"
        placeholder="e.g. 1234 4567 8901 2345"
        autoComplete="cc-number"
        {...field("cardNumber", formatCardNumber)}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Expiry"
          inputMode="numeric"
          placeholder="e.g. 12/34"
          autoComplete="cc-exp"
          {...field("expiry", formatExpiry)}
        />
        <Input
          label="CVV"
          inputMode="numeric"
          placeholder="e.g. 123"
          autoComplete="cc-csc"
          {...field("cvv", formatCvv)}
        />
      </div>

      {formError && (
        <p role="alert" className="text-label-s text-red">
          {formError}
        </p>
      )}
    </form>
  );
}
