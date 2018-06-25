import getResponseAndDataObject from './getResponseAndDataObject';
import { throwResponseError } from './throwErrors';

const getJSON = (url, opts) => {
    const { headers, ...options } = opts || {};
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            ...(headers || null),
        },
        ...(options || null),
    })
        .then(getResponseAndDataObject)
        .then(throwResponseError);
};

export default getJSON;
