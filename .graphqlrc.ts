import { ApiType, shopifyApiProject } from '@shopify/api-codegen-preset';
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import type { IGraphQLConfig } from "graphql-config";

function getConfig() {
  const config = {
    projects: {
      admin: shopifyApiProject({
        apiType: ApiType.Admin,
        apiVersion: LATEST_API_VERSION,
        documents: ["./src/admin/**/*.{js,ts,jsx,tsx}"],
        outputDir: "./types/admin",
      }),
      storefront: shopifyApiProject({
        apiType: ApiType.Storefront,
        apiVersion: LATEST_API_VERSION,
        documents: ["./src/storefront/**/*.{js,ts,jsx,tsx}"],
        outputDir: "./types/storefront",
      }),
    },
  } satisfies IGraphQLConfig;

  return config;
}

const config = getConfig();
export default config;