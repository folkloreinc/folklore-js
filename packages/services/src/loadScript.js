const loadScript = (url) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    document.getElementsByTagName('head')[0].appendChild(script);
});

export default loadScript;
