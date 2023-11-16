/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import * as AppPropTypes from '../../lib/PropTypes';

import styles from '<%= getRelativeStylesPath('components/menus/Menu.jsx', 'menus/menu.module.scss') %>';

const propTypes = {
    items: AppPropTypes.menuItems,
    className: PropTypes.string,
};

const defaultProps = {
    items: [],
    className: null,
};

function Menu({ items, className }) {
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
                {items.map(({ label, url, active = false, external = false, target = '_blank' }, index) => (
                    <li
                        className={classNames([
                            styles.item,
                            {
                                [styles.active]: active,
                            },
                        ])}
                        key={`item-${index}`}
                    >
                        {external ? (
                            <a href={url} target={target} className={styles.link}>
                                {label}
                            </a>
                        ) : (
                            <Link to={url} className={styles.link}>
                                {label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

export default Menu;
