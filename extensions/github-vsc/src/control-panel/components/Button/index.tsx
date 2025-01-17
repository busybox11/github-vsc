import React, { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export type ButtonType = 'primary' | 'secondary';

export type Props = {
  children: ReactNode;
  disabled?: boolean;
  type?: ButtonType;
  onClick: () => void;
};

const Button = ({ children, disabled, type = 'primary', onClick }: Props) => {
  return (
    <button
      disabled={disabled}
      className={classNames(styles.button, type === 'secondary' && styles.secondary)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
