import axios, { type AxiosError } from "axios";

import type { ApiErrorResponse } from "../types/api.types";

/**
 * Returns the API-provided error message when an Axios request fails, or the
 * caller's contextual fallback for network and unexpected errors.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const axiosError: AxiosError<ApiErrorResponse> = error;

    return axiosError.response?.data.message ?? fallback;
  }

  return fallback;
}
