import { Layout as AntLayout } from 'antd';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import styles from './Layout.module.css';
import Menu from './Menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleMenuClick = (key: string) => {
    navigate(key);
    setDrawerVisible(false);
  };

  return (
    <AntLayout className={styles.layout}>
      <Header onMenuClick={() => setDrawerVisible(true)} />
      <Menu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onMenuClick={handleMenuClick}
      />
      <Content>{children}</Content>
      <Footer />
    </AntLayout>
  );
};

export default Layout;
