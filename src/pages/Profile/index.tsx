import React from 'react';
import { Card, Descriptions, Spin, Alert, Tag } from 'antd';
import { PageHeader } from '../../components/custom';
import { useCurrentUserQuery } from '../../api';
import type { UserType } from '../../api';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const { data: user, isLoading, error } = useCurrentUserQuery();

  const userTypeLabels: Record<UserType, string> = {
    NOT_SET: 'Təyin edilməyib',
    STUDENT: 'Tələbə',
    PARENT: 'Valideyn',
    TEACHER: 'Müəllim',
    BRANCH_MANAGER: 'Filial Meneceri',
    BRANCH_ADMIN: 'Filial Admini',
    ORGANIZATION_ADMIN: 'Təşkilat Admini',
  };

  const userTypeColors: Record<UserType, string> = {
    NOT_SET: 'default',
    STUDENT: 'blue',
    PARENT: 'cyan',
    TEACHER: 'green',
    BRANCH_MANAGER: 'orange',
    BRANCH_ADMIN: 'purple',
    ORGANIZATION_ADMIN: 'red',
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Yüklənir..." />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="İstifadəçi məlumatlarını yükləmək mümkün olmadı"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader title="Mənim Profilim" />

      <Card className={styles.card}>
        <Descriptions
          title="Şəxsi Məlumatlar"
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Ad Soyad">
            {user.full_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="İstifadəçi tipi">
            <Tag color={userTypeColors[user.user_type]}>
              {userTypeLabels[user.user_type]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={user.is_active ? 'success' : 'error'}>
              {user.is_active ? 'Aktiv' : 'Deaktiv'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Telefon">
            {user.phone_number || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Doğum tarixi">
            {user.date_of_birth || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ünvan" span={2}>
            {user.address || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Təşkilat ID">
            {user.organization || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Filiallar">
            {user.branches && user.branches.length > 0
              ? user.branches.join(', ')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Yaradılma tarixi">
            {new Date(user.created_at).toLocaleString('az-AZ')}
          </Descriptions.Item>
          <Descriptions.Item label="Yenilənmə tarixi">
            {new Date(user.updated_at).toLocaleString('az-AZ')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;
