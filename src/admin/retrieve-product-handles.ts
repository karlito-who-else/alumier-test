import { client } from './utilities/client.ts';
import type { ProductHandlesQuery } from '../../types/admin/admin.generated.d.ts';

const productHandles = `#graphql
  query productHandles($first: Int!) {
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

const response = await client.request(
  productHandles,
  {
    variables: {
      first: 10,
    },
  },
);

const { data }: { data: ProductHandlesQuery } = response;

data?.products?.edges.forEach((edge) => {
  console.log(edge.node.handle);
});