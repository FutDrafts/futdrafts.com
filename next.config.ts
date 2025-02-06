import type { NextConfig } from "next";
import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti.esmResolve("./src/env/client.ts");
jiti.esmResolve("./src/env/server.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
