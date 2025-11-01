import React from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <AntHeader className={styles.header}>
      <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick}>
        Menyu
      </Button>
    </AntHeader>
  );
};

export default Header;
