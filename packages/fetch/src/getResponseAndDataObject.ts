export type ResponseAndDataObject<TData = unknown> = {
    data: TData;
    response: Response;
};

function getResponseAndDataObject<TData = unknown>(
    response: Response,
): Promise<ResponseAndDataObject<TData>> {
    return response.json().then((data: TData) => ({
        data,
        response,
    }));
}

export default getResponseAndDataObject;
