// Thanks http://stackoverflow.com/questions/1638337/the-best-way-to-synchronize-client-side-javascript-clock-with-server-date
import 'whatwg-fetch';

const getTime = () => new Date().getTime();

type ParseResponseResult = {
    serverTimestamp: number;
    serverClientRequestDiffTime: number;
};

export type GetServerTimeOptions = {
    urlFormat?: string | null;
    parseResponse?: ((response: string) => ParseResponseResult) | null;
};

const getServerTime = (url: string, opts: GetServerTimeOptions = {}): Promise<number> => {
    const options = {
        urlFormat: opts.urlFormat || '{url}?time={timestamp}',
        parseResponse:
            opts.parseResponse ||
            ((response: string) => {
                const responseParts = response.split(',');
                return {
                    serverTimestamp: parseInt(responseParts[0], 10),
                    serverClientRequestDiffTime: parseInt(responseParts[1], 10),
                };
            }),
    };
    const clientTimestamp = getTime();
    const clockUrl = options.urlFormat
        .replace(/\{\s*url\s*\}/, url)
        .replace(/\{\s*timestamp\s*\}/, String(clientTimestamp));
    return fetch(clockUrl, {
        method: 'GET',
    })
        .then((response) => response.text())
        .then((response) => {
            const nowTimeStamp = getTime();
            const { serverTimestamp, serverClientRequestDiffTime } =
                options.parseResponse(response);
            if (
                typeof serverTimestamp === 'undefined' ||
                typeof serverClientRequestDiffTime === 'undefined' ||
                Number.isNaN(serverTimestamp) ||
                Number.isNaN(serverClientRequestDiffTime)
            ) {
                throw new Error('Bad response');
            }
            const serverClientResponseDiffTime = nowTimeStamp - serverTimestamp;
            const responseTime =
                (serverClientRequestDiffTime -
                    nowTimeStamp +
                    (clientTimestamp - serverClientResponseDiffTime)) /
                2;
            return nowTimeStamp + responseTime;
        });
};

export default getServerTime;
