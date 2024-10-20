import React from 'react';

import styles from './Button.module.scss';
import cns from 'classnames';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'mint' | 'success';
}

export function Button({children, onClick, className, variant = 'primary'}: ButtonProps) {
    return (
        <button onClick={onClick} className={cns(className, styles.button, styles[variant])}>
            {children}
        </button>
    )
}
