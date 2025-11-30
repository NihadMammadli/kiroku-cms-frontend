import { Layout } from 'antd';
import type React from 'react';
import styles from './Content.module.css';

const { Content: AntContent } = Layout;

interface ContentProps {
  children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return <AntContent className={styles.content}>{children}</AntContent>;
};

export default Content;
