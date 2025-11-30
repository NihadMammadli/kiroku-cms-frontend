import type { ButtonProps } from 'antd';
import React from 'react';
import { Button } from '../../restyled';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    type?: ButtonProps['type'];
    loading?: boolean;
    danger?: boolean;
  }[];
  extra?: React.ReactNode[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, extra }) => {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.actions}>
        {extra && extra.length > 0 && (
          <div className={styles.extra}>
            {extra.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </div>
        )}
        {actions && actions.length > 0 && (
          <>
            {actions.map((action, index) => (
              <Button
                key={index}
                type={action.type || 'default'}
                icon={action.icon}
                onClick={action.onClick}
                loading={action.loading}
                danger={action.danger}
              >
                {action.label}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
