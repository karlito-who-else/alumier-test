export interface ResponseError {
  // message: string
  // locations: {
  //   line: number
  //   column: number
  // }[]
  extensions: {
    code: "THROTTLED" | "INTERNAL_SERVER_ERROR" | "BAD_USER_INPUT"
    retryAfter?: number
  }
}

export interface ShopifyErrorLike {
  status: number
  message: Error
  response: {
    // status: number
    // statusText: string
    // url: string
    // headers: Record<string, string>
    errors: ResponseError[]
  }
}

export function isObject(
  object: unknown,
): object is Record<string, unknown> {
  return (
    typeof object === 'object' && object !== null && !Array.isArray(object)
  )
};

export function isShopifyError(error: unknown): error is ShopifyErrorLike {
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
