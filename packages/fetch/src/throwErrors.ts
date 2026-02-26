import ResponseError from './ResponseError';
import ValidationError from './ValidationError';
import type { ResponseAndDataObject } from './getResponseAndDataObject';

export function throwResponseError<TData = unknown, TError = unknown>(
    responseObject: ResponseAndDataObject<TData>,
): TData {
    const { response, data } = responseObject;
    if (response.status >= 200 && response.status < 300) {
        return data;
    }
    throw new ResponseError<TError>(
        response.statusText,
        data as unknown as TError,
        response.status,
    );
}

export function throwValidationError<TError = unknown>(error: unknown): never {
    if (error instanceof ResponseError && error.status === 422) {
        throw new ValidationError<TError>(error.message, error.responseData, error.status);
    }
    throw error;
}
