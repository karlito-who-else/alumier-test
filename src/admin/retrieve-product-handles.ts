import { graphqlClient } from '../utilities/client.ts';
import { formatErrorMessage, isShopifyError } from '../utilities/type-guards.ts';

const productHandles = `#graphql
  query productHandles($first: Int = 16) {
    products(first: $first) {
      edges {
        node {
          ... on Product {
            handle
          }
        }
      }
    }
  }`;

try {

  const response = await graphqlClient.request(
    productHandles,
    {
      variables: {
        first: 32,
      },
    },
  );

  const { data, errors } = response;

  if (errors) {
    if (errors.graphQLErrors) {
      throw new AggregateError(errors.graphQLErrors, errors.message);
    }

    throw new Error(errors.message);
  }

  data?.products?.edges.forEach((edge) => {
    console.log(edge.node.handle);
  });
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