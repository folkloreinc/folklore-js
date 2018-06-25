export default class ResponseError extends Error {
    constructor(message, responseData, status) {
        super(message);
        this.name = 'ResponseError';
        this.responseData = responseData;
        this.status = status;
    }

    getResponseData() {
        return this.responseData;
    }
}
