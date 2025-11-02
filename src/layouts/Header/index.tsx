import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCurrentUserQuery, useLogoutMutation } from '../../api';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: user } = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation(messageApi);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Mənim Profilim',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Çıxış',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <AntHeader className={styles.header}>
      {contextHolder}
      <div className={styles.leftSection}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuClick}
          className={styles.menuButton}
        />
        <div className={styles.logo} onClick={() => navigate('/dashboard')}>
          <img src="/kiroku-icon.svg" alt="Kiroku" className={styles.logoImg} />
        </div>
      </div>
      <div className={styles.rightSection}>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <div className={styles.userMenu}>
            <Space>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={user?.profile_picture}
              />
              <span className={styles.userName}>{user?.full_name}</span>
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
