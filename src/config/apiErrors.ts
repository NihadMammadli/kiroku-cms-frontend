// API Error Types for structured error handling

export type ApiErrorType =
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'validation'
  | 'server'
  | 'timeout'
  | 'unknown';

export interface ApiError {
  message: string;
  type: ApiErrorType;
  status?: number;
  data?: unknown;
  originalError?: unknown;
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string' &&
    'type' in error &&
    typeof (error as Record<string, unknown>).type === 'string'
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }

  if (
    error !== null &&
    typeof error === 'object' &&
    'response' in error &&
    error.response !== null &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data !== null &&
    typeof error.response.data === 'object' &&
    'detail' in error.response.data
  ) {
    return String((error.response.data as Record<string, unknown>).detail);
  }

  if (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  ) {
    return (error as Record<string, unknown>).message as string;
  }

  return 'Gözlənilməz xəta baş verdi.';
};
