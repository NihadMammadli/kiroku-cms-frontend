import type { SelectProps as AntSelectProps } from 'antd';
import { Select as AntSelect } from 'antd';
import type React from 'react';
import styles from './Select.module.css';

export interface SelectProps extends AntSelectProps {}

export const Select: React.FC<SelectProps> & {
  Option: typeof AntSelect.Option;
} = ({ className, ...props }) => {
  const classes = [styles.select, className].filter(Boolean).join(' ');
  return <AntSelect className={classes} {...props} />;
};

Select.Option = AntSelect.Option;

export default Select;
