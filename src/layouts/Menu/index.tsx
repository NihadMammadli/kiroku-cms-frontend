import React, { useEffect } from 'react';
import { Drawer, Menu as AntMenu, message, Avatar, Space } from 'antd';
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
  CloseOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation, useCurrentUserQuery } from '../../api';
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
  const { data: user } = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation(messageApi);

  const userTypeLabels: Record<string, string> = {
    NOT_SET: 'Təyin edilməyib',
    STUDENT: 'Tələbə',
    PARENT: 'Valideyn',
    TEACHER: 'Müəllim',
    BRANCH_MANAGER: 'Filial Meneceri',
    BRANCH_ADMIN: 'Filial Admini',
    ORGANIZATION_ADMIN: 'Təşkilat Admini',
  };

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

  const mainMenuItems = [
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
  ];

  const bottomMenuItems = [
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
      title={null}
      placement="left"
      onClose={onClose}
      open={visible}
      width={280}
      className={styles.drawer}
      closeIcon={<CloseOutlined />}
      headerStyle={{ display: 'none' }}
    >
      {contextHolder}
      <div className={styles.drawerContent}>
        <div className={styles.userSection}>
          <button onClick={onClose} className={styles.closeButton}>
            <CloseOutlined />
          </button>
          <Space direction="vertical" size={8} className={styles.userInfo}>
            <Avatar
              size={48}
              icon={<UserOutlined />}
              src={user?.profile_picture}
              className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.full_name || 'User'}</div>
              <div className={styles.userRole}>
                {user?.user_type
                  ? userTypeLabels[user.user_type]
                  : 'Customer Admin'}
              </div>
            </div>
          </Space>
        </div>
        <div className={styles.menuContainer}>
          <AntMenu
            mode="vertical"
            selectedKeys={[getSelectedKey()]}
            items={mainMenuItems}
            onClick={({ key }) => handleMenuClick(key)}
            className={styles.menu}
          />
        </div>
        <div className={styles.bottomMenu}>
          <AntMenu
            mode="vertical"
            selectedKeys={[getSelectedKey()]}
            items={bottomMenuItems}
            onClick={({ key }) => handleMenuClick(key)}
            className={styles.menu}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default Menu;
