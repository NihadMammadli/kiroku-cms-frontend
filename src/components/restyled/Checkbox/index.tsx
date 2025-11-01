import React from 'react';
import {
  Checkbox as AntCheckbox,
  CheckboxProps as AntCheckboxProps,
} from 'antd';
import type { CheckboxGroupProps as AntCheckboxGroupProps } from 'antd/es/checkbox';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends AntCheckboxProps {}
export interface CheckboxGroupProps extends AntCheckboxGroupProps {}

export const Checkbox: React.FC<CheckboxProps> & {
  Group: React.FC<CheckboxGroupProps>;
} = ({ className, ...props }) => {
  const classes = [styles.checkbox, className].filter(Boolean).join(' ');
  return <AntCheckbox className={classes} {...props} />;
};

Checkbox.Group = ({ className, ...props }: CheckboxGroupProps) => {
  const classes = [styles.checkboxGroup, className].filter(Boolean).join(' ');
  return <AntCheckbox.Group className={classes} {...props} />;
};

export default Checkbox;
