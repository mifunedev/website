/**
 * Compatibility exports for older imports. Buyer-facing option content now
 * lives with the canonical offering URLs in config/offerings.ts.
 */
export {
  cloudOptions as pricingPageOptions,
  offeringPaths as homepageOfferings,
  supportOffering,
} from "@/config/offerings";
