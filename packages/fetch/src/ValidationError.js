import ResponseError from './ResponseError';

export default class ValidationError extends ResponseError {
    constructor(message, responseData, status) {
        super(message, responseData, status);
        this.name = 'ValidationError';
    }

    getErrors() {
        return this.responseData;
    }
}
