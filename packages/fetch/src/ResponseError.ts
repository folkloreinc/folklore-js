export default class ResponseError<TError = unknown> extends Error {
    responseData: TError;
    status: number;

    constructor(message: string, responseData: TError, status: number) {
        super(message);
        this.name = 'ResponseError';
        this.responseData = responseData;
        this.status = status;
    }

    getResponseData(): TError {
        return this.responseData;
    }
}
