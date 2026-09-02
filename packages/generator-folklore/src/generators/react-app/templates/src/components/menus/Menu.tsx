import classNames from 'classnames';
import { Link } from 'wouter';

import styles from '<%= getRelativeStylesPath('components/menus/Menu.jsx', 'menus/menu.module.css') %>';

interface MenuItem {
    label: string;
    url: string;
    active?: boolean;
    external?: boolean;
    target?: string;
}

interface MenuProps {
    items?: MenuItem[];
    className?: string | null;
}

function Menu({ items = null, className = null }: MenuProps) {
    return (
        <nav
            className={classNames([
                styles.container,
                {
                    [className]: className !== null,
                },
            ])}
        >
            <ul className={styles.items}>
                {(items || []).map(
                    ({ label = null, url = null, active = false, external = false, target = '_blank' }) => (
                        <li
                            className={classNames([
                                styles.item,
                                {
                                    [styles.active]: active,
                                },
                            ])}
                            key={`item-${label}-${url}`}
                        >
                            {external ? (
                                <a href={url} target={target} className={styles.link}>
                                    {label}
                                </a>
                            ) : (
                                <Link href={url} className={styles.link}>
                                    {label}
                                </Link>
                            )}
                        </li>
                    ),
                )}
            </ul>
        </nav>
    );
}

export default Menu;

