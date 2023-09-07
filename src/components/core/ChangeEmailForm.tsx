"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";
import { Button } from "@/components/core/Button";
import { useTranslations } from "next-intl";

/**
 * The schema for the change email form.
 */
const changeEmailFormSchema = z.object({
  oldPassword: z.string().min(8).max(50),
  newEmail: z.string().email(),
});

/**
 * Type describing the change email form.
 */
export type ChangeEmailForm = z.infer<typeof changeEmailFormSchema>;

type Props = {
  onSubmit: (data: ChangeEmailForm) => void;
  isLoading?: boolean;
};

/**
 * The form used by the user to change her/his email.
 */
export const ChangeEmailForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const t = useTranslations("User");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeEmailForm>({
    resolver: zodResolver(changeEmailFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
          <div className="md:col-span-3">
            <Field
              id="oldPassword"
              label={t("Current password")}
              register={register("oldPassword")}
              type="password"
              error={errors.oldPassword?.message}
            />
          </div>

          <div className="md:col-span-3">
            <Field
              id="newEmail"
              label={t("New email")}
              register={register("newEmail")}
              type="email"
              error={errors.newEmail?.message}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <div>
          <Button
            variant="primary"
            size="medium"
            text={t("Change email")}
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </div>
    </form>
  );
};
