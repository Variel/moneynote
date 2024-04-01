import { Result } from "@backend-base/models/result";

export function ok<T = any>(data?: T): Result<T> {
  return {
    httpStatus: 200,
    result: "success",
    data,
  };
}

export function notFound(message?: string, errorCode?: string): Result {
  return {
    httpStatus: 404,
    result: "error",
    errorMessage: message,
    errorCode,
  };
}

export function badRequest(message?: string, errorCode?: string): Result {
  return {
    httpStatus: 400,
    result: "error",
    errorMessage: message,
    errorCode,
  };
}

export function unauthorized(message?: string, errorCode?: string): Result {
  return {
    httpStatus: 401,
    result: "error",
    errorMessage: message,
    errorCode,
  };
}
