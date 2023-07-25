import { z } from "zod";

/**
 *
 */
export const stripeConfigSchema = z.object({
  paymentIntent: z.object({
    client_secret: z.string(),
  }),
  publishableKey: z.string(),
});

/**
 *
 */
export const stripeServerConfigSchema = z.object({
  publishableKey: z.string(),
});
