import getResponseAndDataObject from './getResponseAndDataObject';
import { throwResponseError, throwValidationError } from './throwErrors';

function postJSON<TData = unknown, TError = unknown>(
    url: string,
    data: unknown,
    opts: RequestInit = {},
): Promise<TData> {
    const { headers, ...options } = opts || {};
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(headers || null),
        },
        body: JSON.stringify(data),
        ...(options || null),
    })
        .then(getResponseAndDataObject<TData>)
        .then(throwResponseError<TData, TError>)
        .catch(throwValidationError<TError>);
}

export default postJSON;
