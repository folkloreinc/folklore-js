// Thanks http://stackoverflow.com/questions/1638337/the-best-way-to-synchronize-client-side-javascript-clock-with-server-date
import 'whatwg-fetch';

const getTime = () => (new Date()).getTime();

const getServerTime = (url, opts) => {
    const options = {
        urlFormat: '{url}?time={timestamp}',
        parseResponse: (response) => {
            const responseParts = response.split(',');
            return {
                serverTimestamp: parseInt(responseParts[0], 10),
                serverClientRequestDiffTime: parseInt(responseParts[1], 10),
            };
        },
        ...Object.keys(opts || {}).reduce((finalOptions, key) => (
            typeof opts[key] !== 'undefined' && opts[key] !== null ? {
                ...finalOptions,
                [key]: opts[key],
            } : finalOptions
        ), {}),
    };
    const clientTimestamp = getTime();
    const clockUrl = options.urlFormat.replace(/\{\s*url\s*\}/, url)
        .replace(/\{\s*timestamp\s*\}/, clientTimestamp);
    return fetch(clockUrl, {
        method: 'GET',
    }).then(response => response.text())
        .then((response) => {
            const nowTimeStamp = getTime();
            const {
                serverTimestamp,
                serverClientRequestDiffTime,
            } = options.parseResponse(response);
            if (
                typeof serverTimestamp === 'undefined' ||
                typeof serverClientRequestDiffTime === 'undefined' ||
                Number.isNaN(serverTimestamp) ||
                Number.isNaN(serverClientRequestDiffTime)
            ) {
                throw new Error('Bad response');
            }
            const serverClientResponseDiffTime = nowTimeStamp - serverTimestamp;
            const responseTime = (
                (serverClientRequestDiffTime - nowTimeStamp) +
                (clientTimestamp - serverClientResponseDiffTime)
            ) / 2;
            return nowTimeStamp + responseTime;
        });
};

export default getServerTime;
