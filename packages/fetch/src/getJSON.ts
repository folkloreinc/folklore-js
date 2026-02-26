import getResponseAndDataObject from './getResponseAndDataObject';
import { throwResponseError } from './throwErrors';

function getJSON<TData = unknown, TError = unknown>(
    url: string,
    opts: RequestInit = {},
): Promise<TData> {
    const { headers, ...options } = opts || {};
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            ...(headers || null),
        },
        ...(options || null),
    })
        .then(getResponseAndDataObject<TData>)
        .then(throwResponseError<TData, TError>);
}

export default getJSON;
