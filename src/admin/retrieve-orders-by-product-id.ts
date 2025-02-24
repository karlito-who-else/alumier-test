import type { ResponseErrors } from "@shopify/shopify-api";
import type { OrdersWithProductQuery } from '../../types/admin/admin.generated.d.ts';
import { client } from './utilities/client.ts';
import { formatErrorMessage, isShopifyError } from './utilities/type-guards.ts';

type OrderResponse = OrdersWithProductQuery['orders']['edges'][number]['node'];

const ordersWithProduct = `#graphql
    query ordersWithProduct($query: String, $first: Int = 128, $after: String) {
      orders(query: $query, first: $first, after: $after) {
        edges {
          node {
            id
            name
            confirmationNumber
            createdAt
            customer {
              ... on Customer {
                id
                locale
                numberOfOrders
                email
                displayName
                createdAt
                amountSpent {
                  amount
                  currencyCode
                }
                statistics {
                  predictedSpendTier
                }
              }
            }
            lineItems(first: 128) {
              edges {
                node {
                  product {
                    ... on Product {
                      id
                      title
                      category {
                        ... on TaxonomyCategory {
                          id
                          fullName
                        }
                      }
                    }
                  }
                  quantity
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

async function getOrders(productId: string, createdAfter: string, afterCursor: string | null = null): Promise<OrderResponse[]> {
  const variables = {
    after: afterCursor,
    query: `created_at:>='${createdAfter}'`,
  };

  try {
    const response = await client.request(ordersWithProduct, variables);

    const { data, errors }: { data: OrdersWithProductQuery, errors: ResponseErrors } = response;

    if (errors) {
      throw new AggregateError(errors, "Error(s) fetching orders");
    }

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
    if (isShopifyError(error)) {
      console.error(formatErrorMessage(error.message));
    }
    else if (error instanceof AggregateError) {
      console.error(error.message);
      console.error(error.name);
      console.error(error.errors);
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

  console.log('\n');
  console.log(`Found ${allOrders.length} orders containing product ${productId} in the last ${days} days.`);
  console.log('\n');


  allOrders.forEach(order => {
    let amountSpent = 'N/A';

    if (order.customer?.amountSpent?.amount) {
      amountSpent = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: order.customer?.amountSpent.currencyCode
      }).format(
        order.customer?.amountSpent.amount,
      );
    }

    const productNode = order.lineItems.edges.find((lineItem) => lineItem.node.product?.id === productId)?.node;

    console.group("Order:", order.name);
    console.info("Order ID:", order.id);
    console.info("Order confirmation number:", order.confirmationNumber);
    console.info("Order date:", order.createdAt);
    console.info("Customer's ID:", order.customer?.id || 'N/A');
    console.info("Customer's name:", order.customer?.displayName || 'N/A'); // I would not log PII to an actual application
    console.info("Customer's email:", order.customer?.email || 'N/A'); // I would not log PII to an actual application
    console.info("Customer's locale:", order.customer?.locale || 'N/A');
    console.info("Customer's total orders to date:", order.customer?.numberOfOrders || 'N/A');
    console.info("Customer's total amount spent to date:", amountSpent);
    console.info("Customer's predicted spend tier:", order.customer?.statistics?.predictedSpendTier || 'N/A');
    console.info("Customer's account created at:", order.customer?.createdAt || 'N/A');
    console.info("Product ID:", productNode?.product?.id);
    console.info("Product Title:", productNode?.product?.title);
    console.info("Product Category ID:", productNode?.product?.category?.id);
    console.info("Product Category Name:", productNode?.product?.category?.fullName);
    console.groupEnd();
    console.log('\n');
  });
} catch (error) {
  console.error('An error occurred', error);
}
