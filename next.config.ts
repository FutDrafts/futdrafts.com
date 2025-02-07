import type { NextConfig } from "next";
import createMdx from "@next/mdx";
import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti.esmResolve("./src/env/client.ts");
jiti.esmResolve("./src/env/server.ts");

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],
};

const withMDX = createMdx({});

export default withMDX(nextConfig);
