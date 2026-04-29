import { generatePath } from '@folklore/routes';
import { useFormValue } from '@panneau/core/contexts';
import TextField from '@panneau/field-text';
import classNames from 'classnames';

type LocalizedSlug = Record<string, string | null | undefined>;

interface PageParent {
    slug?: LocalizedSlug | null;
}

interface PageFormValue {
    parent?: PageParent | null;
    handle?: string | null;
}

interface PageSlugRoutes {
    page?: string | null;
    page_with_parent?: string | null;
}

interface PageSlugFieldProps {
    fieldLocale?: string | null;
    value?: string | null;
    className?: string | null;
    routes: PageSlugRoutes;
    [key: string]: unknown;
}

const PageSlugField = ({
    routes,
    fieldLocale = null,
    className = null,
    value = null,
    ...props
}: PageSlugFieldProps) => {
    const page = useFormValue() as PageFormValue | null;
    const { parent = null, handle = null } = page || {};
    const { slug: parentSlug = null } = parent || {};
    const { page: pageRoute = null, page_with_parent: pageWithParentRoute = null } = routes || {};

    let url =
        pageRoute !== null
            ? generatePath(pageRoute, {
                  page: 'REPLACE',
              })
            : null;

    if (parent !== null && pageWithParentRoute !== null) {
        const localizedParentSlug =
            fieldLocale !== null && parentSlug !== null ? parentSlug[fieldLocale] || null : null;
        url = generatePath(pageWithParentRoute, {
            parent: localizedParentSlug,
            page: 'REPLACE',
        });
    }

    if (handle === 'home') {
        url = `/${fieldLocale}`;
    }

    const fieldClassName =
        className !== null ? classNames('flex-nowrap', className) : classNames('flex-nowrap');

    return (
        <TextField
            prepend={
                url !== null
                    ? `${window.location.protocol}//${window.location.host}${url.replace(
                          'REPLACE',
                          '',
                      )}`
                    : null
            }
            className={fieldClassName}
            value={handle === 'home' ? null : value}
            {...props}
        />
    );
};

export default PageSlugField;
