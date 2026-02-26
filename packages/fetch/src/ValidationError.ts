import ResponseError from './ResponseError';

export default class ValidationError<TError = unknown> extends ResponseError<TError> {
    constructor(message: string, responseData: TError, status: number) {
        super(message, responseData, status);
        this.name = 'ValidationError';
    }

    getErrors(): TError {
        return this.responseData;
    }
}
