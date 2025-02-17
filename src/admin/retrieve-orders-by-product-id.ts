import "dotenv/config";
import '@shopify/shopify-api/adapters/node';
import { shopifyApi } from "@shopify/shopify-api";

const { SHOPIFY_ORDERS_APP_API_SECRET_KEY, SHOPIFY_ADMIN_API_VERSION, SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN, SHOPIFY_STORE_NAME } = process.env;

if (!SHOPIFY_ORDERS_APP_API_SECRET_KEY || !SHOPIFY_ADMIN_API_VERSION || !SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN || !SHOPIFY_STORE_NAME) {
  throw new Error('Missing required environment variables.');
}

const hostName = `${SHOPIFY_STORE_NAME}.myshopify.com`;

const shopify = shopifyApi({
  apiSecretKey: SHOPIFY_ORDERS_APP_API_SECRET_KEY, // Note: this is the API Secret Key, NOT the API access token
  apiVersion: SHOPIFY_ADMIN_API_VERSION,
  isCustomStoreApp: true, // this MUST be set to true (default is false)
  adminApiAccessToken: SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN, // Note: this is the API access token, NOT the API Secret Key
  isEmbeddedApp: false,
  hostName,
});

const session = shopify.session.customAppSession(hostName);

const client = new shopify.clients.Graphql({session});

const response = await client.request(
  `#graphql
  query productHandles($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
        }
      }
    }
  }`,
  {
    variables: {
      first: 10,
    },
  },
);

response.data?.products?.edges.forEach((edge: any) => {
  console.log(edge.node.handle);
});