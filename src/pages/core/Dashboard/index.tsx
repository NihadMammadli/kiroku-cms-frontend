import {
  BookOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Avatar, Card, Col, Row, Space, Spin, Statistic, Tag } from 'antd';
import { useOrganizationQuery, useOrganizationStatisticsQuery } from 'api';
import { useCurrentUserQuery } from 'api/auth';
import { Button } from 'components';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { canManageOrganization } from 'utils/permissions';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUserQuery();

  const isOrgAdmin = user ? canManageOrganization(user) : false;

  const {
    data: organization,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganizationQuery(undefined, {
    enabled: isOrgAdmin,
  });

  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError,
  } = useOrganizationStatisticsQuery(undefined, {
    enabled: isOrgAdmin,
  });

  const getUserTypeLabel = (userType: string) => {
    const typeMap: Record<string, string> = {
      ORGANIZATION_ADMIN: 'Təşkilat Admini',
      BRANCH_ADMIN: 'Filial Admini',
      BRANCH_MANAGER: 'Filial Meneceri',
      TEACHER: 'Müəllim',
      STUDENT: 'Tələbə',
      PARENT: 'Valideyn',
    };
    return typeMap[userType] || 'Təyin edilməyib';
  };

  if (userLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (userError) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="Xəta"
          description="İstifadəçi məlumatlarını yükləmək mümkün olmadı. Xahiş edirik yenidən giriş edin."
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => navigate('/login')}>
              Girişə qayıt
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>İdarə Paneli</h1>
          <p className={styles.subtitle}>Təşkilatınızın bütün məlumatlarına tez baxış</p>
        </div>
      </div>

      {user && (
        <Card className={styles.welcomeCard} bordered={false}>
          <div className={styles.welcomeContent}>
            <div className={styles.avatarSection}>
              <Avatar size={80} className={styles.avatar} icon={<UserOutlined />}>
                {user.full_name.charAt(0)}
              </Avatar>
              <div className={styles.welcomeText}>
                <h2 className={styles.welcomeTitle}>Xoş gəlmisiniz, {user.full_name}!</h2>
                <Space size={8} wrap>
                  <Tag icon={<MailOutlined />} className={styles.infoTag}>
                    {user.email}
                  </Tag>
                  {user.phone_number && (
                    <Tag icon={<PhoneOutlined />} className={styles.infoTag}>
                      {user.phone_number}
                    </Tag>
                  )}
                </Space>
              </div>
            </div>
            <div className={styles.userMetadata}>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>İstifadəçi tipi</span>
                <Tag color="blue" className={styles.roleTag}>
                  {getUserTypeLabel(user.user_type)}
                </Tag>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Status</span>
                <Tag color={user.is_active ? 'success' : 'error'} className={styles.statusTag}>
                  {user.is_active ? 'Aktiv' : 'Deaktiv'}
                </Tag>
              </div>
            </div>
          </div>
        </Card>
      )}

      {isOrgAdmin && statistics && (
        <div className={styles.statisticsSection}>
          <h3 className={styles.sectionTitle}>Statistika</h3>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className={`${styles.statCard} ${styles.statCardBranches}`} bordered={false}>
                <div className={styles.statIcon}>
                  <ShopOutlined />
                </div>
                <Statistic
                  title="Filiallar"
                  value={statistics.total_branches || 0}
                  valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                  className={styles.statistic}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className={`${styles.statCard} ${styles.statCardStudents}`} bordered={false}>
                <div className={styles.statIcon}>
                  <TeamOutlined />
                </div>
                <Statistic
                  title="Tələbələr"
                  value={statistics.total_students || 0}
                  valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                  className={styles.statistic}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className={`${styles.statCard} ${styles.statCardTeachers}`} bordered={false}>
                <div className={styles.statIcon}>
                  <UserOutlined />
                </div>
                <Statistic
                  title="Müəllimlər"
                  value={statistics.total_teachers || 0}
                  valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                  className={styles.statistic}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className={`${styles.statCard} ${styles.statCardCourses}`} bordered={false}>
                <div className={styles.statIcon}>
                  <BookOutlined />
                </div>
                <Statistic
                  title="Kurslar"
                  value={statistics.total_courses || 0}
                  valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
                  className={styles.statistic}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {isOrgAdmin && organization && (
        <Card
          className={styles.organizationCard}
          loading={orgLoading}
          bordered={false}
          title={
            <div className={styles.cardTitleWrapper}>
              <ShopOutlined className={styles.cardTitleIcon} />
              <span>Təşkilat Məlumatları</span>
            </div>
          }
        >
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <div className={styles.orgHeader}>
                <h3 className={styles.orgName}>{organization.name}</h3>
                <Space size={8}>
                  <Tag color="purple" className={styles.codeTag}>
                    {organization.code}
                  </Tag>
                  <Tag color={organization.is_active ? 'success' : 'error'}>
                    {organization.is_active ? 'Aktiv' : 'Deaktiv'}
                  </Tag>
                </Space>
              </div>
            </Col>
            {organization.description && organization.description.trim() && (
              <Col xs={24}>
                <div className={styles.orgDescription}>{organization.description}</div>
              </Col>
            )}
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                {organization.email && organization.email.trim() && (
                  <Col xs={24} sm={12}>
                    <div className={styles.contactItem}>
                      <MailOutlined className={styles.contactIcon} />
                      <div>
                        <div className={styles.contactLabel}>Email</div>
                        <div className={styles.contactValue}>{organization.email}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {organization.phone_number && organization.phone_number.trim() && (
                  <Col xs={24} sm={12}>
                    <div className={styles.contactItem}>
                      <PhoneOutlined className={styles.contactIcon} />
                      <div>
                        <div className={styles.contactLabel}>Telefon</div>
                        <div className={styles.contactValue}>{organization.phone_number}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {organization.website && organization.website.trim() && (
                  <Col xs={24} sm={12}>
                    <div className={styles.contactItem}>
                      <GlobalOutlined className={styles.contactIcon} />
                      <div>
                        <div className={styles.contactLabel}>Vebsayt</div>
                        <a
                          href={organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.contactLink}
                        >
                          {organization.website}
                        </a>
                      </div>
                    </div>
                  </Col>
                )}
                {organization.address && organization.address.trim() && (
                  <Col xs={24} sm={12}>
                    <div className={styles.contactItem}>
                      <EnvironmentOutlined className={styles.contactIcon} />
                      <div>
                        <div className={styles.contactLabel}>Ünvan</div>
                        <div className={styles.contactValue}>{organization.address}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {(organization.city ||
                  organization.state ||
                  organization.country ||
                  organization.postal_code) && (
                  <Col xs={24}>
                    <div className={styles.locationInfo}>
                      <EnvironmentOutlined className={styles.locationIcon} />
                      <span>
                        {[
                          organization.city,
                          organization.state,
                          organization.country,
                          organization.postal_code,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
            <Col xs={24}>
              <div className={styles.orgStats}>
                <div className={styles.orgStatItem}>
                  <ShopOutlined className={styles.orgStatIcon} />
                  <div>
                    <div className={styles.orgStatValue}>{organization.branch_count}</div>
                    <div className={styles.orgStatLabel}>Filial sayı</div>
                  </div>
                </div>
                <div className={styles.orgStatItem}>
                  <TeamOutlined className={styles.orgStatIcon} />
                  <div>
                    <div className={styles.orgStatValue}>{organization.total_students}</div>
                    <div className={styles.orgStatLabel}>Ümumi tələbələr</div>
                  </div>
                </div>
                <div className={styles.orgStatItem}>
                  <div className={styles.orgStatValue}>
                    {new Date(organization.created_at).toLocaleDateString('az-AZ', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className={styles.orgStatLabel}>Yaradılma tarixi</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {isOrgAdmin && (orgError || statsError) && !organization && !statistics && (
        <Alert
          message="Məlumat yoxdur"
          description="Təşkilat və ya statistika məlumatları tapılmadı."
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default Dashboard;
