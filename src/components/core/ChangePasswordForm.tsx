"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";
import { Button } from "@/components/core/Button";

/**
 *
 */
const ChangePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(8).max(50),
    newPassword: z.string().min(8).max(50),
    repeatNewPassword: z.string().min(8).max(50),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Passwords do not match",
    path: ["repeatNewPassword"],
  });

/**
 *
 */
export type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>;

type Props = {
  onSubmit: (data: ChangePasswordForm) => void;
  isLoading?: boolean;
};

/**
 *
 */
export const ChangePasswordForm: React.FC<Props> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
          <div className="md:col-span-3">
            <Field
              label="Current password"
              id="oldPassword"
              register={register("oldPassword")}
              type="password"
              autoComplete="current-password"
              error={errors.oldPassword?.message?.toString()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
          <div className="md:col-span-3">
            <Field
              id="newPassword"
              label="New password"
              register={register("newPassword")}
              type="password"
              error={errors.newPassword?.message}
            />
          </div>

          <div className="md:col-span-3">
            <Field
              id="repeatNewPassword"
              label="Repeat new password"
              register={register("repeatNewPassword")}
              type="password"
              error={errors.repeatNewPassword?.message}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <div className="w-48">
          <Button
            variant="primary"
            size="medium"
            text="Change password"
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </div>
    </form>
  );
};
