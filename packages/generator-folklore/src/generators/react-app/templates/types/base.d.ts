type ReactNode = import('react').ReactNode;

interface IntlMessage {
    id?: string;
    defaultMessage?: string;
}

interface Labels {
    [key: string]: string;
}

interface Theme {
    name: string;
}

interface MenuItem {
    id: string;
    url: string;
    active?: boolean;
    external?: boolean;
    target?: string;
    label?: string | ReactNode;
    icon?: ReactNode;
}

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    [key: string]: unknown;
}

