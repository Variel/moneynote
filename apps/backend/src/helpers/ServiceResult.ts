export type ServiceResult<TData = never, TErrorCode extends string = never> =
  | {
      success: true;
      data?: TData;
    }
  | {
      success: false;
      message: string;
      errorCode?: TErrorCode;
    };
