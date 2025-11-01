import React from 'react';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import styles from './Table.module.css';

export interface TableProps<T = any> extends AntTableProps<T> {}

export const Table = <T extends object>({
  className,
  ...props
}: TableProps<T>) => {
  const classes = [styles.table, className].filter(Boolean).join(' ');
  return <AntTable<T> className={classes} {...props} />;
};

export default Table;
