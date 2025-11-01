import React, { useState } from 'react';
import { Layout as AntLayout, Button, Space, Drawer, Menu } from 'antd';
import {
  LogoutOutlined,
  MenuOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  DashboardOutlined,
  SunOutlined,
  MoonOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLogoutMutation } from '../mutations/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.css';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleMenuClick = (key: string) => {
    navigate(key);
    setDrawerVisible(false);
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/dashboard') return '/dashboard';
    if (path === '/products') return '/products';
    if (path === '/logs') return '/logs';
    if (path === '/orders') return '/orders';
    return '/dashboard';
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'İdarə Paneli',
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Məhsullar',
    },
    {
      key: '/orders',
      icon: <OrderedListOutlined />,
      label: 'Sifarişlər',
    },
    {
      key: '/logs',
      icon: <FileTextOutlined />,
      label: 'Loglar',
    },
  ];

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          {isAuthenticated && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              className={styles.menuButton}
            >
              Menyu
            </Button>
          )}
        </div>
        <div className={styles.logo} onClick={() => navigate('/dashboard')}>
          uBot
        </div>
        <Space className={styles.headerActions}>
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={(e) => toggleTheme(e)}
            className={styles.themeToggle}
            title={isDark ? 'İşıqlı rejim' : 'Qaranlıq rejim'}
          />
          {isAuthenticated && (
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={logoutMutation.isPending}
              className={styles.logoutButton}
            >
              Çıxış
            </Button>
          )}
        </Space>
      </Header>

      <Drawer
        title="Naviqasiya"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className={styles.drawer}
      >
        <Menu
          mode="vertical"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          className={styles.drawerMenu}
        />
      </Drawer>

      <Content className={styles.content}>{children}</Content>
      <Footer className={styles.footer}></Footer>
    </AntLayout>
  );
};

export default Layout;
