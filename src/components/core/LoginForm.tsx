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
const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

/**
 *
 */
export type LoginForm = z.infer<typeof LoginFormSchema>;

type Props = {
  onSubmit: (data: LoginForm) => void;
  isLoading?: boolean;
};

/**
 *
 */
export const LoginForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const t = useTranslations("User");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(LoginFormSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div>
          <Field
            label={t("Email")}
            id="email"
            register={register("email")}
            autoComplete="email"
            error={errors.email?.message?.toString()}
          />
        </div>

        <div>
          <Field
            label={t("Password")}
            id="password"
            register={register("password")}
            type="password"
            autoComplete="current-password"
            error={errors.password?.message?.toString()}
          />
        </div>
      </div>

      <div className="mt-12">
        <Button
          variant="primary"
          size="medium"
          text={t("Login")}
          type="submit"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};
