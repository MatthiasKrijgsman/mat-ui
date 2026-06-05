import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Read the library version from the root package.json so the showcase always
// displays the published version — bump package.json only, no second edit.
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const libVersion = (
  JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8")) as { version: string }
).version;

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/mat-ui" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@matthiaskrijgsman/mat-ui"],
  env: {
    NEXT_PUBLIC_LIB_VERSION: libVersion,
  },
};

export default nextConfig;
