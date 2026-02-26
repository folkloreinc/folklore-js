import getResponseAndDataObject from './getResponseAndDataObject';
import { throwResponseError, throwValidationError } from './throwErrors';

type UploadFileOptions = RequestInit & {
    headers?: HeadersInit | null;
    fileParamName?: string;
};

const defaultOptions: UploadFileOptions = {
    headers: null,
    fileParamName: 'file',
};

function uploadFile<TData = unknown>(
    url: string,
    file: Blob | string,
    opts: UploadFileOptions | null = null,
): Promise<TData> {
    const { headers, fileParamName, ...options } = {
        ...defaultOptions,
        ...opts,
    };
    const formData = new FormData();
    formData.append(fileParamName || 'file', file);
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            ...headers,
        },
        body: formData,
        ...(options || null),
    })
        .then(getResponseAndDataObject<TData>)
        .then(throwResponseError)
        .catch(throwValidationError);
}

export default uploadFile;
