"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/env/client";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: env.NEXT_PUBLIC_POSTHOG_KEY!,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function ClientPostHogProvider(
  { children }: { children: React.ReactNode },
) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
