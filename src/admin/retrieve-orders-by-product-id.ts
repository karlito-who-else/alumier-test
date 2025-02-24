import type { OrdersWithProductQuery } from '../../types/admin/admin.generated.d.ts';
import { client } from './utilities/client.ts';
import { formatErrorMessage, isShopifyError } from './utilities/type-guards.ts';

const ordersWithProduct = `#graphql
    query ordersWithProduct($query: String, $first: Int = 128, $after: String) {
      orders(query: $query, first: $first, after: $after) {
        edges {
          node {
            id
            name
            createdAt
            lineItems(first: 128) {
              edges {
                node {
                  product {
                    id
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

async function getOrders(productId: string, createdAfter: string, afterCursor: string | null = null): Promise<any[]> {
  const variables = {
    after: afterCursor,
    query: `created_at:>='${createdAfter}'`,
  };

  try {
    const response = await client.request(ordersWithProduct, variables);

    const { data }: { data: OrdersWithProductQuery } = response;

    const orders = data.orders.edges.map((edge) => edge.node).filter((order) => {
        return order.lineItems.edges.some((lineItem) => lineItem.node.product?.id === productId);
    });

    if (data.orders.pageInfo.hasNextPage) {
        const nextOrders = await getOrders(productId, createdAfter, data.orders.pageInfo.endCursor);
        return orders.concat(nextOrders);
    } else {
        return orders;
    }
  } catch (error) {
    console.error('Error fetching orders:', error);

    if (isShopifyError(error)) {
      console.error(formatErrorMessage(error.message));
      // console.error(error);
    }
    else if (typeof error === 'string') {
      console.error(error)
    }

    throw error; // Re-throw other errors
  }
}

const days = 30;

const today = new Date();

const createdAfterDate = new Date();
createdAfterDate.setDate(today.getDate() - days);

const createdAfter = createdAfterDate.toISOString();

const productId = 'gid://shopify/Product/15153767186767';

try {
  const allOrders = await getOrders(productId, createdAfter);
  console.log(`Found ${allOrders.length} orders containing product ${productId} in the last ${days} days.`);

  allOrders.forEach(order => console.log(order.name, order.createdAt));
} catch (error) {
  console.error('An error occurred', error);
}
