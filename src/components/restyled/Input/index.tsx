import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import type { TextAreaProps as AntTextAreaProps } from 'antd/es/input';
import styles from './Input.module.css';

export interface InputProps extends AntInputProps {}
export interface TextAreaProps extends AntTextAreaProps {}

export const Input: React.FC<InputProps> & {
  TextArea: React.FC<TextAreaProps>;
  Password: typeof AntInput.Password;
} = ({ className, ...props }) => {
  const classes = [styles.input, className].filter(Boolean).join(' ');
  return <AntInput className={classes} {...props} />;
};

Input.TextArea = ({ className, ...props }: TextAreaProps) => {
  const classes = [styles.input, styles.inputTextarea, className]
    .filter(Boolean)
    .join(' ');
  return <AntInput.TextArea className={classes} {...props} />;
};

Input.Password = AntInput.Password;

export default Input;
