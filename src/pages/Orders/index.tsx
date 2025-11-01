import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Select,
  Divider,
  Drawer,
  Tag,
  message,
} from 'antd';
import {
  SearchOutlined,
  ClearOutlined,
  SortAscendingOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { ordersAPI, type Order } from '../../api/orders';
import { useFetchUmicoOrdersMutation } from '../../mutations';
import styles from './index.module.scss';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
};

const Orders: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);
  const [ordering, setOrdering] = useState<string>('-ordered_at');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { width } = useWindowSize();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders', page, pageSize, searchTerm, stateFilter, ordering],
    queryFn: () =>
      ordersAPI.getAll(
        page,
        searchTerm || undefined,
        stateFilter,
        pageSize,
        ordering || undefined
      ),
  });

  const { data: stateNames = [] } = useQuery({
    queryKey: ['orderStateNames'],
    queryFn: ordersAPI.getStateNames,
  });

  const fetchUmicoMutation = useFetchUmicoOrdersMutation(messageApi);

  if (error) {
    return (
      <div className={styles.productsContainer}>
        <Card className={styles.productsCard}>
          <div className={styles.errorMessage}>
            Sifarişləri yükləmədə xəta: {(error as Error).message}
          </div>
        </Card>
      </div>
    );
  }

  const getStateColor = (state: string) => {
    const stateColors: Record<string, string> = {
      İmtina: 'red',
      Tamamlanmış: 'green',
      Hazırlanır: 'blue',
      Göndərilib: 'orange',
      Gözləyir: 'gold',
    };
    return stateColors[state] || 'default';
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Sifariş №',
      dataIndex: 'umico_order_number',
      key: 'umico_order_number',
      width: 120,
      render: (text: string, record: Order) => (
        <a
          href={record.umico_order_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0ea5e9', textDecoration: 'none' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Müştəri',
      dataIndex: 'customer_full_name',
      key: 'customer_full_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'state_name',
      key: 'state_name',
      width: 120,
      render: (state: string) => (
        <Tag color={getStateColor(state)}>{state}</Tag>
      ),
    },
    {
      title: 'Məbləğ',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 100,
      render: (text: string) => `${text}₼`,
    },
    {
      title: 'Tarix',
      dataIndex: 'ordered_at',
      key: 'ordered_at',
      width: 160,
      responsive: ['lg'],
      render: (date: string) => new Date(date).toLocaleString('az-AZ'),
    },
    {
      title: 'Ümumi sifariş',
      dataIndex: 'total_order_count',
      key: 'total_order_count',
      width: 90,
      responsive: ['md'],
    },
    {
      title: 'İmtina sayı',
      dataIndex: 'total_cancel_count',
      key: 'total_cancel_count',
      width: 90,
      responsive: ['xl'],
    },
    // {
    //   title: 'Əməliyyatlar',
    //   key: 'actions',
    //   width: 100,
    //   fixed: 'right',
    //   render: (_text: unknown, record: Order) => (
    //     <Button
    //       type="link"
    //       icon={<LinkOutlined />}
    //       href={record.umico_order_url}
    //       target="_blank"
    //       size="small"
    //     >
    //       Bax
    //     </Button>
    //   ),
    // },
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleShowSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleFetchUmico = () => {
    fetchUmicoMutation.mutate();
  };

  const handleSearch = () => {
    setSearchTerm(searchValue);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setSearchTerm('');
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setStateFilter(undefined);
    setOrdering('-ordered_at');
    setPage(1);
  };

  const handleStateFilterChange = (value: string | undefined) => {
    setStateFilter(value);
    setPage(1);
  };

  const handleOrderingChange = (value: string) => {
    setOrdering(value);
    setPage(1);
  };

  const orderingOptions = [
    { label: 'Tarix (Yeni)', value: '-ordered_at' },
    { label: 'Tarix (Köhnə)', value: 'ordered_at' },
    { label: 'Məbləğ (Artan)', value: 'total_amount' },
    { label: 'Məbləğ (Azalan)', value: '-total_amount' },
    { label: 'İmtina sayı (Artan)', value: 'total_cancel_count' },
    { label: 'İmtina sayı (Azalan)', value: '-total_cancel_count' },
    { label: 'Sifariş sayı (Artan)', value: 'total_order_count' },
    { label: 'Sifariş sayı (Azalan)', value: '-total_order_count' },
  ];

  const stateOptions = stateNames.map((state) => ({
    label: state,
    value: state,
  }));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPaginationConfig = () => {
    const isMobile = width < 576;
    const isTablet = width < 768;

    return {
      current: page,
      total: orders?.count || 0,
      pageSize: pageSize,
      onChange: handlePageChange,
      showTotal: isMobile
        ? undefined
        : (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} dən ${total} sifariş`,
      showSizeChanger: true,
      onShowSizeChange: handleShowSizeChange,
      pageSizeOptions: ['10', '20', '50', '100'],
      responsive: true,
      simple: isMobile,
      showQuickJumper: !isTablet,
      showLessItems: isMobile,
      size: (isMobile ? 'small' : 'default') as 'small' | 'default',
      className: styles.pagination,
      locale: {
        jump_to: 'Keç',
        jump_to_confirm: 'təsdiq et',
        page: '',
        prev_page: 'Əvvəlki səhifə',
        next_page: 'Növbəti səhifə',
        prev_5: 'Əvvəlki 5 səhifə',
        next_5: 'Növbəti 5 səhifə',
        prev_3: 'Əvvəlki 3 səhifə',
        next_3: 'Növbəti 3 səhifə',
        items_per_page: '/ səhifə',
      },
    };
  };

  return (
    <div className={styles.productsContainer}>
      {contextHolder}
      <Card
        title={
          <div className={styles.productsTitle}>
            <div className={styles.titleSection}>
              <h2>Sifarişlər</h2>
            </div>
            <div className={styles.actionsSection}>
              <Button
                type="primary"
                onClick={handleFetchUmico}
                loading={fetchUmicoMutation.isPending}
                size={width < 576 ? 'small' : 'middle'}
                icon={<SyncOutlined />}
              >
                Yenilə
              </Button>
            </div>
          </div>
        }
        className={styles.productsCard}
      >
        <div className={styles.searchSection}>
          <Space.Compact className={styles.searchContainer}>
            <Input
              placeholder="Sifariş nömrəsi və ya müştəri adı ilə axtarış..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={isLoading}
              className={styles.searchButton}
            >
              {width < 576 ? '' : 'Axtarış'}
            </Button>
            {searchTerm && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearSearch}
                title="Axtarışı təmizlə"
                className={styles.clearButton}
              >
                {width < 576 ? '' : 'Təmizlə'}
              </Button>
            )}
          </Space.Compact>
        </div>

        <div className={styles.filtersSection}>
          <div className={styles.filtersToggle}>
            <Button
              type="default"
              icon={<SettingOutlined />}
              onClick={() => setSidebarVisible(true)}
              size={width < 576 ? 'small' : 'middle'}
            >
              {width < 768 ? 'Filtrlər' : 'Filtrlər və Sıralama'}
              {(stateFilter !== undefined || ordering !== '-ordered_at') && (
                <span className={styles.activeFiltersIndicator}>
                  {
                    [
                      stateFilter !== undefined && 'Status',
                      ordering && ordering !== '-ordered_at' && 'Sort',
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            dataSource={orders?.results}
            rowKey="id"
            loading={isLoading}
            pagination={getPaginationConfig()}
            className={styles.productsTable}
            scroll={{ x: 1200 }}
            size="small"
          />
        </div>
      </Card>

      <Drawer
        title={
          <div className={styles.sidebarHeader}>
            <Space>
              <SettingOutlined />
              <span>Filtrlər və Sıralama</span>
            </Space>
            <Button
              type="text"
              icon={<CloseCircleOutlined />}
              onClick={handleClearAllFilters}
              size="small"
              className={styles.clearAllButton}
            />
          </div>
        }
        placement="right"
        width={width < 768 ? '100%' : 400}
        onClose={() => setSidebarVisible(false)}
        open={sidebarVisible}
        className={styles.filtersSidebar}
        styles={{
          body: { padding: '24px' },
          header: { borderBottom: '1px solid #f0f0f0' },
        }}
      >
        <div className={styles.filtersContent}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Sifariş Statusu</div>
            <Select
              placeholder="Status seçin"
              value={stateFilter}
              onChange={handleStateFilterChange}
              style={{ width: '100%' }}
              allowClear
              options={stateOptions}
              size="middle"
            />
          </div>

          <Divider className={styles.filterDivider} />

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Sıralama</div>
            <Select
              placeholder="Sıralama seçin"
              value={ordering}
              onChange={handleOrderingChange}
              style={{ width: '100%' }}
              allowClear
              suffixIcon={<SortAscendingOutlined />}
              options={orderingOptions}
              size="middle"
            />
          </div>

          <div className={styles.filterActions}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                onClick={handleClearAllFilters}
                icon={<ClearOutlined />}
                size="middle"
                block
              >
                Bütün filtrləri təmizlə
              </Button>
              {/* <Button
                onClick={() => setSidebarVisible(false)}
                type="primary"
                size="middle"
                block
              >
                Tətbiq et
              </Button> */}
            </Space>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Orders;
