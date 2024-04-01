export type HttpStatusCode =
  | 200
  | 201
  | 204
  | 301
  | 304
  | 302
  | 400
  | 401
  | 403
  | 404
  | 405
  | 415
  | 500
  | 503;

export interface Result<T = any> {
  httpStatus: HttpStatusCode;

  result: "success" | "error";
  errorCode?: string;
  errorMessage?: string;
  data?: T;
}
