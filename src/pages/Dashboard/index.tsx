import React from 'react';
import { Card, Row, Col, Button, Badge } from 'antd';
import {
  ShoppingOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { logsAPI, productsAPI } from '../../api';
import { ordersAPI } from '../../api/orders';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll(1, undefined, undefined, undefined),
  });

  const { data: logs } = useQuery({
    queryKey: ['logs'],
    queryFn: () => logsAPI.getAll(1, undefined),
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll(1, undefined, undefined),
  });

  const handleNavigateToProducts = () => {
    navigate('/products');
  };

  const handleNavigateToLogs = () => {
    navigate('/logs');
  };

  const handleNavigateToOrders = () => {
    navigate('/orders');
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>İdarə Paneli</h1>
          <p className={styles.subtitle}>
            uBot sisteminin ümumi görünüşü və statistikası
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            className={styles.statCard}
            onClick={handleNavigateToProducts}
            hoverable
            bordered={false}
          >
            <div className={styles.statCardContent}>
              <div className={styles.statHeader}>
                <div className={styles.iconWrapper}>
                  <ShoppingOutlined className={styles.statIcon} />
                </div>
                <span className={styles.statLabel}>Məhsullar</span>
              </div>
              <div className={styles.statValue}>{products?.count ?? 0}</div>
              <div className={styles.statFooter}>
                <span className={styles.statDescription}>
                  Cəmi aktiv məhsul sayı
                </span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            className={styles.statCard}
            onClick={handleNavigateToOrders}
            hoverable
            bordered={false}
          >
            <div className={styles.statCardContent}>
              <div className={styles.statHeader}>
                <div className={styles.iconWrapper}>
                  <ShoppingCartOutlined className={styles.statIcon} />
                </div>
                <span className={styles.statLabel}>Sifarişlər</span>
              </div>
              <div className={styles.statValue}>{orders?.count ?? 0}</div>
              <div className={styles.statFooter}>
                <span className={styles.statDescription}>
                  Ümumi sifariş sayı
                </span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            className={styles.statCard}
            onClick={handleNavigateToLogs}
            hoverable
            bordered={false}
          >
            <div className={styles.statCardContent}>
              <div className={styles.statHeader}>
                <div className={styles.iconWrapper}>
                  <FileTextOutlined className={styles.statIcon} />
                </div>
                <span className={styles.statLabel}>Loglar</span>
              </div>
              <div className={styles.statValue}>{logs?.count ?? 0}</div>
              <div className={styles.statFooter}>
                <span className={styles.statDescription}>
                  Bu gün əlavə edilən log sayı
                </span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card className={styles.statCard} bordered={false}>
            <div className={styles.statCardContent}>
              <div className={styles.statHeader}>
                <div className={styles.iconWrapper}>
                  <CheckCircleOutlined className={styles.statIcon} />
                </div>
                <span className={styles.statLabel}>Status</span>
              </div>
              <div className={styles.statValue}>
                <Badge status="success" />
                <span className={styles.statusText}>Aktiv</span>
              </div>
              <div className={styles.statFooter}>
                <span className={styles.statDescription}>
                  Sistem normal işləyir
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Sürətli Keçidlər</h2>
        <p className={styles.sectionDescription}>
          Tez-tez istifadə olunan bölmələr
        </p>
      </div>

      <Row gutter={[16, 16]} className={styles.actionsRow}>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Card
            className={styles.actionCard}
            bordered={false}
            onClick={handleNavigateToProducts}
          >
            <div className={styles.actionCardContent}>
              <div className={styles.actionIconWrapper}>
                <ShoppingOutlined className={styles.actionIcon} />
              </div>
              <div className={styles.actionInfo}>
                <h3 className={styles.actionTitle}>Məhsullar</h3>
                <p className={styles.actionDescription}>
                  Məhsulları idarə et, qiymətləri yenilə və statusları dəyiş
                </p>
              </div>
              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                className={styles.actionButton}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Card
            className={styles.actionCard}
            bordered={false}
            onClick={handleNavigateToOrders}
          >
            <div className={styles.actionCardContent}>
              <div className={styles.actionIconWrapper}>
                <ShoppingCartOutlined className={styles.actionIcon} />
              </div>
              <div className={styles.actionInfo}>
                <h3 className={styles.actionTitle}>Sifarişlər</h3>
                <p className={styles.actionDescription}>
                  Sifarişləri idarə et və statusları izlə
                </p>
              </div>
              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                className={styles.actionButton}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Card
            className={styles.actionCard}
            bordered={false}
            onClick={handleNavigateToLogs}
          >
            <div className={styles.actionCardContent}>
              <div className={styles.actionIconWrapper}>
                <FileTextOutlined className={styles.actionIcon} />
              </div>
              <div className={styles.actionInfo}>
                <h3 className={styles.actionTitle}>Loglar</h3>
                <p className={styles.actionDescription}>
                  Sistem loglarını izlə və təhlil et
                </p>
              </div>
              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                className={styles.actionButton}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* System Overview */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Sistem Məlumatları</h2>
      </div>

      <Row gutter={[16, 16]} className={styles.overviewRow}>
        <Col xs={24} lg={24}>
          <Card className={styles.overviewCard} bordered={false}>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewItem}>
                <div className={styles.overviewIcon}>
                  <SyncOutlined />
                </div>
                <div className={styles.overviewContent}>
                  <div className={styles.overviewLabel}>Son yeniləmə</div>
                  <div className={styles.overviewValue}>
                    Bir neçə dəqiqə əvvəl
                  </div>
                </div>
              </div>

              <div className={styles.overviewItem}>
                <div className={styles.overviewIcon}>
                  <ClockCircleOutlined />
                </div>
                <div className={styles.overviewContent}>
                  <div className={styles.overviewLabel}>İşləmə müddəti</div>
                  <div className={styles.overviewValue}>24/7 Aktiv</div>
                </div>
              </div>

              <div className={styles.overviewItem}>
                <div className={styles.overviewIcon}>
                  <CheckCircleOutlined />
                </div>
                <div className={styles.overviewContent}>
                  <div className={styles.overviewLabel}>Sistem sağlamlığı</div>
                  <div className={styles.overviewValue}>Yaxşı</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
