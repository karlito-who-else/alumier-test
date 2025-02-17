/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type ProductHandlesQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
}>;


export type ProductHandlesQuery = { products: { edges: Array<{ node: Pick<AdminTypes.Product, 'handle'> }> } };

interface GeneratedQueryTypes {
  "#graphql\n  query productHandles($first: Int!) {\n    products(first: $first) {\n      edges {\n        node {\n          handle\n        }\n      }\n    }\n  }": {return: ProductHandlesQuery, variables: ProductHandlesQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
