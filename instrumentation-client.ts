import posthog from "posthog-js";

// Automatically initialized by Next.js at runtime
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  defaults: "2025-05-24",
  capture_exceptions: true, // Enables error tracking
  person_profiles: "always",
  debug: process.env.NODE_ENV === "development",
});
