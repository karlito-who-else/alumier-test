/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type OrdersWithProductQueryVariables = AdminTypes.Exact<{
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  first?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type OrdersWithProductQuery = { orders: { edges: Array<{ node: (
        Pick<AdminTypes.Order, 'id' | 'name' | 'confirmationNumber' | 'createdAt'>
        & { customer?: AdminTypes.Maybe<(
          Pick<AdminTypes.Customer, 'id' | 'locale' | 'numberOfOrders' | 'email' | 'displayName' | 'createdAt'>
          & { amountSpent: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>, statistics: Pick<AdminTypes.CustomerStatistics, 'predictedSpendTier'> }
        )>, lineItems: { edges: Array<{ node: (
              Pick<AdminTypes.LineItem, 'quantity'>
              & { product?: AdminTypes.Maybe<(
                Pick<AdminTypes.Product, 'id' | 'title'>
                & { category?: AdminTypes.Maybe<Pick<AdminTypes.TaxonomyCategory, 'id' | 'fullName'>> }
              )> }
            ) }> } }
      ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type ProductHandlesQueryVariables = AdminTypes.Exact<{
  first?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
}>;


export type ProductHandlesQuery = { products: { edges: Array<{ node: Pick<AdminTypes.Product, 'handle'> }> } };

interface GeneratedQueryTypes {
  "#graphql\n    query ordersWithProduct($query: String, $first: Int = 128, $after: String) {\n      orders(query: $query, first: $first, after: $after) {\n        edges {\n          node {\n            id\n            name\n            confirmationNumber\n            createdAt\n            customer {\n              ... on Customer {\n                id\n                locale\n                numberOfOrders\n                email\n                displayName\n                createdAt\n                amountSpent {\n                  amount\n                  currencyCode\n                }\n                statistics {\n                  predictedSpendTier\n                }\n              }\n            }\n            lineItems(first: 128) {\n              edges {\n                node {\n                  product {\n                    ... on Product {\n                      id\n                      title\n                      category {\n                        ... on TaxonomyCategory {\n                          id\n                          fullName\n                        }\n                      }\n                    }\n                  }\n                  quantity\n                }\n              }\n            }\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ": {return: OrdersWithProductQuery, variables: OrdersWithProductQueryVariables},
  "#graphql\n  query productHandles($first: Int = 16) {\n    products(first: $first) {\n      edges {\n        node {\n          ... on Product {\n            handle\n          }\n        }\n      }\n    }\n  }": {return: ProductHandlesQuery, variables: ProductHandlesQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
