import { env } from "@/env/server";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [adminClient()],
});
