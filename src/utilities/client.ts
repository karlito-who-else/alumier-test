import "dotenv/config";
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

const { SHOPIFY_ORDERS_APP_API_SECRET_KEY, SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN, SHOPIFY_STORE_NAME } = process.env;

if (!SHOPIFY_ORDERS_APP_API_SECRET_KEY || !SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN || !SHOPIFY_STORE_NAME) {
  throw new Error('Missing required environment variables.');
}

const hostName = `${SHOPIFY_STORE_NAME}.myshopify.com`;

export const shopify = shopifyApi({
  adminApiAccessToken: SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN, // Note: this is the API access token, NOT the API Secret Key
  apiSecretKey: SHOPIFY_ORDERS_APP_API_SECRET_KEY, // Note: this is the API Secret Key, NOT the API access token
  apiVersion: LATEST_API_VERSION,
  future: {
    customerAddressDefaultFix: true,
    lineItemBilling: true,
    unstable_managedPricingSupport: true,
  },
  hostName,
  isCustomStoreApp: true, // this MUST be set to true (default is false)
  isEmbeddedApp: false,
});

export const session = shopify.session.customAppSession(hostName);

export const graphqlClient = new shopify.clients.Graphql({session});
