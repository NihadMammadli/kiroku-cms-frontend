import React from 'react';
import { Drawer, Menu as AntMenu } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  PhoneOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
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
    return location.pathname;
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'İdarə Paneli',
    },
    {
      key: 'divider-1',
      type: 'divider' as const,
    },
    {
      key: '/organizations',
      icon: <GlobalOutlined />,
      label: 'Təşkilatlar',
    },
    {
      key: '/branches',
      icon: <BankOutlined />,
      label: 'Filiallar',
    },
    {
      key: 'divider-2',
      type: 'divider' as const,
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: 'Kurslar',
    },
    {
      key: '/course-groups',
      icon: <TeamOutlined />,
      label: 'Qruplar',
    },
    {
      key: 'divider-3',
      type: 'divider' as const,
    },
    {
      key: '/enrollments',
      icon: <UserAddOutlined />,
      label: 'Qeydiyyatlar',
    },
    {
      key: '/attendance',
      icon: <CheckCircleOutlined />,
      label: 'Davamiyyət',
    },
    {
      key: 'divider-4',
      type: 'divider' as const,
    },
    {
      key: '/inquiries',
      icon: <PhoneOutlined />,
      label: 'Sorğular',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'İstifadəçilər',
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
