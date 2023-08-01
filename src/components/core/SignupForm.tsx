"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";
import { Button } from "@/components/core/Button";
import { useTranslations } from "next-intl";

/**
 *
 */
const SignupFormSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

/**
 *
 */
export type SignupForm = z.infer<typeof SignupFormSchema>;

type Props = {
  onSubmit: (data: SignupForm) => void;
  isLoading?: boolean;
  initialValues?: Partial<SignupForm>;
};

/**
 *
 */
export const SignupForm: React.FC<Props> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const t = useTranslations("User");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div>
          <Field
            label={t("First name")}
            id="firstName"
            register={register("firstName")}
            error={errors.firstName?.message}
          />
        </div>

        <div>
          <Field
            label={t("Last name")}
            id="lastName"
            register={register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <div>
          <Field
            label={t("Email")}
            id="email"
            register={register("email")}
            autoComplete="email"
            error={errors.email?.message}
          />
        </div>

        <div>
          <Field
            label={t("Password")}
            id="password"
            register={register("password")}
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
          />
        </div>
      </div>

      <div className="mt-12">
        <Button
          variant="primary"
          size="medium"
          text={t("Signup")}
          type="submit"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};
