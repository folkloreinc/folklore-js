const loadScriptWithCallback = (url, callback) =>
    new Promise(resolve => {
        window[callback] = () => resolve();
        const script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    });

export default loadScriptWithCallback;
