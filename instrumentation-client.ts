import posthog from "posthog-js"

// Automatically initialized by Next.js at runtime
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: '2025-05-24',
  capture_exceptions: true, // Enables error tracking
  debug: process.env.NODE_ENV === "development",
});
