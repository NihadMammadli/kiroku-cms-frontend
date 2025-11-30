import { Layout } from 'antd';
import type React from 'react';
import styles from './Footer.module.css';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return <AntFooter className={styles.footer} />;
};

export default Footer;
