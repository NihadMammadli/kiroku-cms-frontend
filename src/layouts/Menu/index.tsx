import React, { useEffect } from 'react';
import { Drawer, Menu as AntMenu, message } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  PhoneOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../api';
import styles from './Menu.module.css';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  onMenuClick: (key: string) => void;
}

const Menu: React.FC<MenuProps> = ({ visible, onClose, onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const logoutMutation = useLogoutMutation(messageApi);

  // Handle navigation after successful logout
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      setTimeout(() => {
        navigate('/login');
        onClose();
      }, 500);
    }
  }, [logoutMutation.isSuccess, navigate, onClose]);

  const getSelectedKey = () => {
    return location.pathname;
  };

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      logoutMutation.mutate();
    } else {
      onMenuClick(key);
    }
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'İdarə Paneli',
    },
    {
      key: '/branches',
      icon: <BankOutlined />,
      label: 'Filiallar',
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
      key: '/inquiries',
      icon: <PhoneOutlined />,
      label: 'Sorğular',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'İstifadəçilər',
    },
    {
      key: 'divider-bottom',
      type: 'divider' as const,
    },
    {
      key: '/profile',
      icon: <SettingOutlined />,
      label: 'Mənim Profilim',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıxış',
      danger: true,
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
      {contextHolder}
      <AntMenu
        mode="vertical"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        className={styles.menu}
      />
    </Drawer>
  );
};

export default Menu;
