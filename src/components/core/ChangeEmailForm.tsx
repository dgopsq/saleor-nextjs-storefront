"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";
import { Button } from "@/components/core/Button";

/**
 *
 */
const ChangeEmailFormSchema = z.object({
  oldPassword: z.string().min(8).max(50),
  newEmail: z.string().email(),
});

/**
 *
 */
export type ChangeEmailForm = z.infer<typeof ChangeEmailFormSchema>;

type Props = {
  onSubmit: (data: ChangeEmailForm) => void;
  isLoading?: boolean;
};

/**
 *
 */
export const ChangeEmailForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeEmailForm>({
    resolver: zodResolver(ChangeEmailFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Field
              id="oldPassword"
              label="Current password"
              register={register("oldPassword")}
              type="password"
              error={errors.oldPassword?.message}
            />
          </div>

          <div className="sm:col-span-3">
            <Field
              id="newEmail"
              label="New email"
              register={register("newEmail")}
              type="email"
              error={errors.newEmail?.message}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <div className="w-48">
          <Button
            variant="primary"
            size="medium"
            text="Change email"
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </div>
    </form>
  );
};
