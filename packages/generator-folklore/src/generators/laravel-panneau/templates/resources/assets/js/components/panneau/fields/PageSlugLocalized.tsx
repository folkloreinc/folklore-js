import { useFormValue } from '@panneau/core/contexts';
import LocalizedField from '@panneau/field-localized';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useMemo } from 'react';
import slugify from 'slugify';

type LocalizedValue = Record<string, string>;

interface PageTitleValue {
    title?: LocalizedValue | null;
}

interface PageSlugLocalizedFieldProps {
    value?: LocalizedValue | null;
    locales?: string[] | null;
    [key: string]: unknown;
}

const PageSlugField = ({ value = null, locales = null, ...props }: PageSlugLocalizedFieldProps) => {
    const page = useFormValue() as PageTitleValue | null;
    const { title = null } = page || {};
    const finalValue = useMemo(() => {
        if (locales === null) {
            return value;
        }
        return locales.reduce<LocalizedValue | null>(
            (newValue, key) =>
                newValue === null || isEmpty(newValue[key])
                    ? {
                          ...newValue,
                          [key]: slugify(get(title, key, '')),
                      }
                    : newValue,
            value,
        );
    }, [locales, value, title]);

    return <LocalizedField value={finalValue} locales={locales || []} {...props} />;
};

export default PageSlugField;
