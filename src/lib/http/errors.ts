import type { ApiError } from "@/types/api";

export class HttpError extends Error implements ApiError {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: "An unexpected error occurred",
  };
}
