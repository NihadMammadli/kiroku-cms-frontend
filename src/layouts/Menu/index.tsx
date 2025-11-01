import React from 'react';
import { Drawer, Menu as AntMenu } from 'antd';
import { ShoppingOutlined, DashboardOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import styles from './Menu.module.css';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  onMenuClick: (key: string) => void;
}

const Menu: React.FC<MenuProps> = ({ visible, onClose, onMenuClick }) => {
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') return '/dashboard';
    if (path === '/branches') return '/branches';
    return '/dashboard';
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'İdarə Paneli',
    },
    {
      key: '/branches',
      icon: <ShoppingOutlined />,
      label: 'Filiallar',
    },
  ];

  return (
    <Drawer
      title="Naviqasiya"
      placement="left"
      onClose={onClose}
      open={visible}
      width={280}
      className={styles.drawer}
    >
      <AntMenu
        mode="vertical"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        onClick={({ key }) => onMenuClick(key)}
        className={styles.menu}
      />
    </Drawer>
  );
};

export default Menu;
