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
                } catch (e) {}

                if (newRichAd !== null) {
                    const container = containerRef.current || document;
                    const iframe = container.querySelector('iframe') || null;
                    if (iframe !== null && iframe.contentWindow === event.source) {
                        setRichAd(newRichAd);
                    }
                }
            }
        });
    }, [id]);

    return richAd;
}

export default useRichAd;
