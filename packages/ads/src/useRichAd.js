import { useEffect, useState } from 'react';

function useRichAd(containerRef, id) {
    const [richAd, setRichAd] = useState(null);

    useEffect(() => {
        setRichAd(null);
        window.addEventListener('message', (event) => {
            if (event.origin.match(/safeframe\.googlesyndication\.com/) !== null) {

                let newRichAd = null;
                try {
                    const eventData = JSON.parse(event.data) || null;
                    newRichAd = eventData !== null ? eventData.richAd || null : null;
                } catch(e) {}

                if (newRichAd !== null) {
                    const container = containerRef.current || document;
                    const iframes = container.querySelector('iframe');
                    for (let i = 0; i < iframes.length; i += 1) {
                        const iframe = iframes[i];
                        if (iframe.contentWindow === event.source) {
                            setRichAd(newRichAd);
                            break;
                        }
                    }
                }
            }
        });
    }, [id]);

    return richAd;
}

export default useRichAd;
