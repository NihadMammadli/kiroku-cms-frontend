import React from 'react';
import { Layout } from 'antd';
import styles from './Footer.module.css';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return <AntFooter className={styles.footer}></AntFooter>;
};

export default Footer;
