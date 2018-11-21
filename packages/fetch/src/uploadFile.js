import getResponseAndDataObject from './getResponseAndDataObject';
import { throwResponseError, throwValidationError } from './throwErrors';

const defaultOptions = {
    headers: null,
    fileParamName: 'file',
};

const uploadFile = (url, file, opts = null) => {
    const { headers, fileParamName, ...options } = {
        ...defaultOptions,
        ...opts,
    };
    const formData = new FormData();
    formData.append(fileParamName, file);
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            ...headers,
        },
        body: formData,
        ...(options || null),
    }).then(getResponseAndDataObject)
        .then(throwResponseError)
        .catch(throwValidationError);
};

export default uploadFile;
