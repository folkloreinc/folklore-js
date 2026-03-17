import classNames from 'classnames';
import { ReactNode, MouseEvent } from 'react';
import { Link } from 'wouter';

import styles from '<%= getRelativeStylesPath('components/buttons/Button.jsx', 'buttons/button.module.css') %>';

type Label = IntlMessage | ReactNode;

interface ButtonProps {
    text?: string | null;
    type?: 'button' | 'submit' | 'reset';
    href?: string | null;
    external?: boolean;
    direct?: boolean;
    target?: string;
    label?: Label | null;
    children?: Label | null;
    icon?: ReactNode | null;
    iconPosition?: 'left' | 'right' | 'inline';
    disabled?: boolean;
    loading?: boolean;
    disableOnLoading?: boolean;
    className?: string | null;
    iconClassName?: string | null;
    labelClassName?: string | null;
    onClick?: ((e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) | null;
}

function Button({
    text = null,
    type = 'button',
    href = null,
    external = false,
    direct = false,
    target = '_blank',
    label = null,
    children = null,
    icon = null,
    iconPosition = 'inline',
    disabled = false,
    loading = false,
    disableOnLoading = true,
    className = null,
    iconClassName = null,
    labelClassName = null,
    onClick = null,
}: ButtonProps) {
    const finalLabel = label || children;
    const hasChildren = label !== null && children !== null;
    const hasIcon = icon !== null;
    const hasInlineIcon = hasIcon && (iconPosition === 'inline' || text === null);
    const hasIconColumns = hasIcon && !hasInlineIcon;
    const content = (
        <>
            {hasInlineIcon ? (
                <>
                    <span
                        className={classNames([
                            styles.icon,
                            {
                                [iconClassName]: iconClassName !== null,
                            },
                        ])}
                    >
                        {icon}
                    </span>
                    {text !== null ? (
                        <span
                            className={classNames([
                                styles.label,
                                {
                                    [labelClassName]: labelClassName !== null,
                                },
                            ])}
                        >
                            {text}
                        </span>
                    ) : null}
                </>
            ) : null}
            {hasIconColumns ? (
                <>
                    <span className={classNames([styles.left])}>
                        {iconPosition === 'left' ? icon : null}
                    </span>
                    <span className={classNames([styles.center])}>{text}</span>
                    <span className={classNames([styles.right])}>
                        {iconPosition === 'right' ? icon : null}
                    </span>
                    {hasChildren ? children : null}
                </>
            ) : null}
            {!hasIcon ? finalLabel : null}
            {hasChildren ? children : null}
        </>
    );

    const buttonClassNames = classNames([
        styles.container,
        {
            [styles.withIcon]: hasIcon,
            [styles.withIconColumns]: hasIconColumns,
            [styles.withText]: text !== null,
            [styles.isLink]: href !== null,
            [styles.isDisabled]: disabled,
            [styles.isLoading]: loading,
            [className]: className !== null,
        },
    ]);
    if (href !== null) {
        return external || direct ? (
            <a
                href={href}
                className={buttonClassNames}
                onClick={onClick}
                target={external ? target : null}
            >
                {content}
            </a>
        ) : (
            <Link href={href} className={buttonClassNames} onClick={onClick}>
                {content}
            </Link>
        );
    }
    return (
        <button
            type={type}
            className={buttonClassNames}
            onClick={onClick}
            disabled={disabled || (disableOnLoading && loading)}
        >
            {content}
        </button>
    );
}

export default Button;
