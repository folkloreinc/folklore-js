import { useEffect, useState } from 'react';
import WebFont from 'webfontloader';

type FontsProviderConfig = {
    families?: string[];
    id?: string | null;
    [key: string]: unknown;
};

type FontsConfig = Record<string, FontsProviderConfig>;

function useFonts(fonts: FontsConfig): { loaded: boolean } {
    const [loaded, setLoaded] = useState(false);

    const families = Object.keys(fonts)
        .reduce((allFamilies: (string | null)[], type) => {
            const { families: typeFamilies = [], id = null } = fonts[type];
            return [...allFamilies, ...typeFamilies, id];
        }, [])
        .filter((it): it is string => it !== null)
        .sort()
        .join(',');

    useEffect(() => {
        let canceled = false;
        const onFontsActive = () => {
            if (!canceled) {
                setLoaded(true);
            }
        };
        WebFont.load({
            ...fonts,
            active: onFontsActive,
        });
        return () => {
            canceled = true;
        };
    }, [families]);

    return {
        loaded,
    };
}

export default useFonts;
