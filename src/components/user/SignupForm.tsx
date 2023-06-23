"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/core/Field";

/**
 *
 */
const SignupFormSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

/**
 *
 */
export type SignupForm = z.infer<typeof SignupFormSchema>;

type Props = {};

/**
 *
 */
export const SignupForm: React.FC<Props> = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignupFormSchema) });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <div className="space-y-6">
        <div>
          <Field
            label="First name"
            id="firstName"
            register={register("firstName")}
            error={errors.firstName?.message?.toString()}
          />
        </div>

        <div>
          <Field
            label="Last name"
            id="lastName"
            register={register("lastName")}
            error={errors.lastName?.message?.toString()}
          />
        </div>

        <div>
          <Field
            label="Email address"
            id="email"
            register={register("email")}
            autoComplete="email"
            error={errors.email?.message?.toString()}
          />
        </div>

        <div>
          <Field
            label="Password"
            id="password"
            register={register("password")}
            type="password"
            autoComplete="current-password"
            error={errors.password?.message?.toString()}
          />
        </div>
      </div>

      <div className="mt-12">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};
