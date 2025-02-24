// lib/tavily-types.ts

export interface TavilyErrorResponse {
  status: number;
  message: string;
  code?: string;
}

export interface TavilyError extends Error {
  response?: {
    status: number;
    data?: TavilyErrorResponse;
  };
  status?: number;
  code?: string;
}

export function isTavilyError(error: any): error is TavilyError {
  return (
    error &&
    (error.response?.status === 403 ||
      error.status === 403 ||
      error.code === 'invalid_api_key' ||
      (error.message && error.message.toLowerCase().includes('api key')))
  );
}