export interface ShopifyAdminAPIErrorLike {
}

export interface ShopifyAPIResponseErrorsLike {
  graphQLErrors: any[]
  message: Error
  networkStatusCode: number
  response: Response
}

export interface ShopifyResponse {
  data: unknown
  extensions: {
    cost: {
      requestedQueryCost: number,
      actualQueryCost: number,
      throttleStatus: {
        maximumAvailable: number,
        currentlyAvailable: number,
        restoreRate: number,
      }
    }
  }
}

export function isObject(
  object: unknown,
): object is Record<string, unknown> {
  return (
    typeof object === 'object' && object !== null && !Array.isArray(object)
  )
};

export function isShopifyError(error: unknown): error is ShopifyAPIResponseErrorsLike {
  if (!isObject(error))
    return false

  if (error instanceof Error)
    return true

  return findError(error)
};

export function findError<T extends object>(error: T): boolean {
  if (Object.prototype.toString.call(error) === '[object Error]') {
    return true
  }

  const prototype = Object.getPrototypeOf(error) as T | null

  return prototype === null ? false : findError(prototype)
}

export function formatErrorMessage(err: Error): string {
  return JSON.stringify(err, Object.getOwnPropertyNames(err))
}
