import { APIResponse, Headers } from '../openapi';

export type SuccessCode = 200 | 201;
export type SuccessResponse<C extends SuccessCode, P, H extends Headers>
  = APIResponse<C, {result: P}, H>;
export function success<C extends SuccessCode, P, H extends Headers>(
  result: P,
  code: C,
  headers?: H,
): SuccessResponse<C, P, H> {
  return [code, {result}, headers || {} as H];
}

export type ErrorCode = 400 | 401 | 402 | 403 | 404 | 409 | 500 | 501 | 503;
export type ErrorResponse<C extends ErrorCode, P extends string, H extends Headers>
  = APIResponse<C, {error: P, statusCode: C, message?: string}, H>;
export function error<C extends ErrorCode, P extends string, H extends Headers>(
  err: P,
  code: C,
  message?: string,
  headers?: H,
): ErrorResponse<C, P, H> {
  return [code, {error: err, statusCode: code, message}, headers || {} as H];
}
