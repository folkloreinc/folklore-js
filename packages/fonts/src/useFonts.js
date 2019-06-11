import {
    useState, useEffect,
} from 'react';
import WebFont from 'webfontloader';

const useFonts = (fonts) => {
    const [loaded, setLoaded] = useState(false);

    const families = Object.keys(fonts)
        .reduce((allFamilies, type) => {
            const { families: typeFamilies = [] } = fonts[type];
            return [...allFamilies, ...typeFamilies];
        }, [])
        .sort();

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
    }, [...families]);

    return {
        loaded,
    };
};

export default useFonts;
