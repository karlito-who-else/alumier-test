import type { ResponseErrors } from "@shopify/shopify-api";
import { client } from '../utilities/client.ts';
import { formatErrorMessage, isShopifyError } from '../utilities/type-guards.ts';

export async function request<TQuery, TVariables>(query: TQuery, variables: TVariables) {
  try {
    const response = await client.request(
      query,
      {
        variables,
      },
    );
  
    const { data, errors }: { data: TQuery, errors: ResponseErrors } = response;
  
    if (errors) {
      throw new AggregateError(errors, "Error(s) requesting data");
    }
  
    return data;
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