import { publicConfig } from "@/misc/config";
import { Metadata } from "next";

/**
 *
 */
export const commonMetadata: Metadata = {
  title: publicConfig.seoTitle,
  description: publicConfig.seoDescription,
};
