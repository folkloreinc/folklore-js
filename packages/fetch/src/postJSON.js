import getResponseAndDataObject from './getResponseAndDataObject';
import { throwResponseError, throwValidationError } from './throwErrors';

const postJSON = (url, data, opts) => {
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
    }).then(getResponseAndDataObject)
        .then(throwResponseError)
        .catch(throwValidationError);
};

export default postJSON;
