import ResponseError from './ResponseError';
import ValidationError from './ValidationError';

export const throwResponseError = (responseObject) => {
    const { response, data } = responseObject;
    if (response.status >= 200 && response.status < 300) {
        return data;
    }
    throw new ResponseError(response.statusText, data, response.status);
};

export const throwValidationError = (error) => {
    if (error.name === 'ResponseError' && error.status === 422) {
        throw new ValidationError(error.message, error.responseData, error.status);
    }
    throw error;
};
