"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, subYears } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AvatarUpload } from "@/features/auth/components/avatar-upload";
import { useFilterOptions } from "@/features/sessions/hooks";
import { applyApiErrors } from "@/lib/forms/apply-api-errors";
import {
  digitsOnly,
  formatMobileNumber,
  normalizeMobileNumber,
} from "@/lib/forms/masks";
import { useSingleFlightMutate } from "@/lib/hooks/use-single-flight-mutate";
import type { User } from "@/types/api";
import { getEligibilityMessage } from "../eligibility";
import { useUpdateProfile } from "../hooks";
import { type ProfileValues, profileSchema } from "../schemas";
import { DateField } from "./date-field";

const toFormValues = (user: User): ProfileValues => ({
  fullName: user.fullName ?? "",
  mobileNumber: formatMobileNumber(normalizeMobileNumber(user.mobileNumber)),
  dateOfBirth: user.dateOfBirth?.slice(0, 10) ?? "",
  preferredVenueId: user.preferredVenue ? String(user.preferredVenue.id) : "",
});

export function ProfileForm({ user }: { user: User }) {
  const { data: options } = useFilterOptions();
  const mutation = useUpdateProfile();
  const mutate = useSingleFlightMutate(mutation);
  const { isPending } = mutation;
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: toFormValues(user),
  });

  const mobile = register("mobileNumber");
  const dateOfBirth = register("dateOfBirth");

  const submit = handleSubmit((values) => {
    setFormError(null);
    setSaved(false);

    mutate(
      {
        fullName: values.fullName.trim(),
        mobileNumber: digitsOnly(values.mobileNumber),
        dateOfBirth: values.dateOfBirth,
        preferredVenueId: values.preferredVenueId,
        avatar: values.avatar,
      },
      {
        onSuccess: (updated) => {
          reset(toFormValues(updated));
          setSaved(true);
        },
        onError: (error) => setFormError(applyApiErrors(error, setError)),
      },
    );
  });

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex max-w-220 flex-col gap-9"
    >
      <div className="flex flex-col gap-6">
        <AvatarUpload
          value={watch("avatar")}
          currentUrl={user.avatar}
          error={errors.avatar?.message}
          onChange={(file) =>
            setValue("avatar", file, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />

        <Input
          label="Full name"
          placeholder="e.g. Jane Doe"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <div className="flex flex-col gap-2">
          <Input
            label="Email"
            value={user.email}
            readOnly
            aria-readonly="true"
            className="[&_input]:text-fg-secondary"
          />
          <p className="text-body-s text-fg-secondary">
            Set at registration and cannot be changed
          </p>
        </div>

        <Input
          label="Mobile number"
          inputMode="numeric"
          placeholder="e.g. 555 123 456"
          autoComplete="tel-national"
          error={errors.mobileNumber?.message}
          {...mobile}
          onChange={(event) => {
            event.target.value = formatMobileNumber(event.target.value);
            return mobile.onChange(event);
          }}
        />

        <div className="flex flex-col gap-2">
          <DateField
            label="Date of birth"
            max={format(subYears(new Date(), 12), "yyyy-MM-dd")}
            error={errors.dateOfBirth?.message}
            name={dateOfBirth.name}
            onBlur={dateOfBirth.onBlur}
            onChange={dateOfBirth.onChange}
            inputRef={dateOfBirth.ref}
          />
          {user.age !== null && options && (
            <p className="text-body-s text-fg-secondary">
              {getEligibilityMessage(user.age, options.ageRatings)}
            </p>
          )}
        </div>

        <Select
          label="Preferred Venue (Optional)"
          {...register("preferredVenueId")}
        >
          <option value="" className="bg-card">
            Select a venue
          </option>
          {options?.venues.map((venue) => (
            <option key={venue.id} value={venue.id} className="bg-card">
              {venue.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col items-start gap-3">
        <Button
          type="submit"
          loading={isPending}
          disabled={!isDirty || !isValid}
        >
          Save changes
        </Button>
        {saved && !isDirty && (
          <output className="text-label-s text-green">Profile saved</output>
        )}
        {formError && (
          <p role="alert" className="text-label-s text-red">
            {formError}
          </p>
        )}
      </div>
    </form>
  );
}
