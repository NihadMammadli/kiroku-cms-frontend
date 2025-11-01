import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  message,
  Input,
  Space,
  Select,
  Radio,
  Divider,
  Drawer,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  SyncOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ClearOutlined,
  PlayCircleOutlined,
  SortAscendingOutlined,
  SettingOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { productsAPI, type Product } from '../../api/products';
import {
  useUpdateMinPriceMutation,
  useToggleActiveMutation,
  useFetchUmicoMutation,
  useActivateAllMutation,
  useDeactivateProductMutation,
  useActivateProductMutation,
} from '../../mutations';
import UpdateModal from './update-modal';
import ActivateModal from './activate-modal';
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

const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activateModalVisible, setActivateModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [activeToBotFilter, setActiveToBotFilter] = useState<
    boolean | undefined
  >(undefined);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [mpPriceBelowMinFilter, setMpPriceBelowMinFilter] = useState<
    boolean | undefined
  >(undefined);
  const [ordering, setOrdering] = useState<string>('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { width } = useWindowSize();

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'products',
      page,
      pageSize,
      searchTerm,
      activeToBotFilter,
      isActiveFilter,
      mpPriceBelowMinFilter,
      ordering,
    ],
    queryFn: () =>
      productsAPI.getAll(
        page,
        searchTerm || undefined,
        activeToBotFilter,
        isActiveFilter,
        mpPriceBelowMinFilter,
        pageSize,
        ordering || undefined
      ),
  });

  const updateMutation = useUpdateMinPriceMutation(messageApi);
  const toggleActiveMutation = useToggleActiveMutation(messageApi);
  const fetchUmicoMutation = useFetchUmicoMutation(messageApi);
  const activateAllMutation = useActivateAllMutation(messageApi);
  const activateProductMutation = useActivateProductMutation(messageApi);
  const deactivateProductMutation = useDeactivateProductMutation(messageApi);

  React.useEffect(() => {
    if (updateMutation.isSuccess) {
      setIsModalVisible(false);
      setSelectedProduct(null);
    }
  }, [updateMutation.isSuccess]);

  if (error) {
    return (
      <div className={styles.productsContainer}>
        <Card className={styles.productsCard}>
          <div className={styles.errorMessage}>
            Məhsulları yükləmədə xəta: {(error as Error).message}
          </div>
        </Card>
      </div>
    );
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      render: (text: string, record: Product) => (
        <a
          href={record.product_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0ea5e9', textDecoration: 'none' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Umico ID',
      dataIndex: 'umico_id',
      key: 'umico_id',
      width: 100,
      responsive: ['lg'],
    },
    {
      title: 'Qiymət',
      dataIndex: 'price',
      key: 'price',
      width: 90,
      responsive: ['md'],
      render: (text: number) => `${text}₼`,
    },
    {
      title: 'Endirimli qiymət',
      dataIndex: 'retail_price',
      key: 'retail_price',
      width: 120,
      render: (text: number) => `${text}₼`,
    },
    {
      title: 'Min qiymət',
      dataIndex: 'min_price',
      key: 'min_price',
      width: 100,
      render: (text: number) => `${text}₼`,
    },
    {
      title: 'Bot aktiv',
      dataIndex: 'active_to_bot',
      key: 'active_to_bot',
      width: 80,
      render: (text: boolean) => (text ? 'Bəli' : 'Xeyr'),
      responsive: ['md'],
    },
    {
      title: 'Məhsul aktiv',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (text: boolean) => (text ? 'Bəli' : 'Xeyr'),
      responsive: ['lg'],
    },
    {
      title: (
        <Space size={4}>
          <span>Limitdən Aşağı</span>
          <Tooltip title="Bu sütun məhsulun qiymətinin bazar yerindəki (marketplace) qiymətdən aşağı olduğunu göstərir">
            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'mp_price_is_below_min_price',
      key: 'mp_price_is_below_min_price',
      width: 140,
      render: (text: boolean) => (text ? 'Bəli' : 'Xeyr'),
    },
    {
      title: 'Bot aktiv et',
      key: 'toggle_active',
      width: 120,
      render: (_, record: Product) => (
        <Button
          type={record.active_to_bot ? 'default' : 'primary'}
          size="small"
          icon={record.active_to_bot ? <CloseOutlined /> : <CheckOutlined />}
          onClick={() => handleToggleActive(record)}
          loading={toggleActiveMutation.isPending}
          danger={record.active_to_bot}
        >
          {width < 768
            ? record.active_to_bot
              ? 'Off'
              : 'On'
            : record.active_to_bot
              ? 'Deaktiv et'
              : 'Aktiv et'}
        </Button>
      ),
    },

    {
      title: 'Məhsul aktiv et',
      key: 'toggle_active_product',
      width: 120,
      render: (_, record: Product) => (
        <Button
          type={record.is_active ? 'default' : 'primary'}
          size="small"
          icon={record.is_active ? <CloseOutlined /> : <CheckOutlined />}
          onClick={() => handleToggleActiveProduct(record)}
          loading={
            activateProductMutation.isPending ||
            deactivateProductMutation.isPending
          }
          danger={record.is_active}
        >
          {width < 768
            ? record.is_active
              ? 'Off'
              : 'On'
            : record.is_active
              ? 'Deaktiv et'
              : 'Aktiv et'}
        </Button>
      ),
    },
    {
      title: 'Dəyiş',
      key: 'action',
      width: 80,
      render: (_, record: Product) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleUpdateClick(record)}
        />
      ),
    },
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleShowSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    setPage(1); // Reset to first page when changing page size
  };

  const handleUpdateClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleToggleActive = (product: Product) => {
    toggleActiveMutation.mutate({
      productId: product.id,
      active: !product.active_to_bot,
    });
  };

  const handleToggleActiveProduct = (product: Product) => {
    if (product?.is_active) {
      deactivateProductMutation.mutate({ offer_id: product.offer_id });
    } else {
      setSelectedProduct(product);
      setActivateModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleActivateModalClose = () => {
    setActivateModalVisible(false);
    setSelectedProduct(null);
  };

  const handleUpdate = (productId: string, newMinPrice: number) => {
    updateMutation.mutate({ productId, minPrice: newMinPrice });
  };

  const handleActivate = (
    productId: string,
    oldPrice: number,
    retailPrice: number,
    qty: number
  ) => {
    activateProductMutation.mutate(
      {
        offer_id: productId,
        old_price: oldPrice,
        retail_price: retailPrice,
        qty: qty,
      },
      {
        onSuccess: () => {
          handleActivateModalClose();
        },
      }
    );
  };

  const handleFetchUmico = () => {
    fetchUmicoMutation.mutate();
  };

  const handleActivateAll = () => {
    activateAllMutation.mutate();
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
    setActiveToBotFilter(undefined);
    setIsActiveFilter(undefined);
    setMpPriceBelowMinFilter(undefined);
    setOrdering('');
    setPage(1);
  };

  const handleBotActiveFilterChange = (value: boolean | undefined) => {
    setActiveToBotFilter(value);
    setPage(1);
  };

  const handleProductActiveFilterChange = (value: boolean | undefined) => {
    setIsActiveFilter(value);
    setPage(1);
  };

  const handleMpPriceFilterChange = (value: boolean | undefined) => {
    setMpPriceBelowMinFilter(value);
    setPage(1);
  };

  const handleOrderingChange = (value: string) => {
    setOrdering(value);
    setPage(1);
  };

  const orderingOptions = [
    { label: 'Ad (A-Z)', value: 'name' },
    { label: 'Ad (Z-A)', value: '-name' },
    { label: 'Qiymət (Artan)', value: 'price' },
    { label: 'Qiymət (Azalan)', value: '-price' },
    { label: 'Endirimli qiymət (Artan)', value: 'retail_price' },
    { label: 'Endirimli qiymət (Azalan)', value: '-retail_price' },
    { label: 'Minimum qiymət (Artan)', value: 'min_price' },
    { label: 'Minimum qiymət (Azalan)', value: '-min_price' },
  ];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Responsive pagination configuration
  const getPaginationConfig = () => {
    const isMobile = width < 576;
    const isTablet = width < 768;

    return {
      current: page,
      total: products?.count || 0,
      pageSize: pageSize,
      onChange: handlePageChange,
      showTotal: isMobile
        ? undefined
        : (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} dən ${total} məhsul`,
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
              <h2>Məhsullar</h2>
            </div>
            <div className={styles.actionsSection}>
              <Space size={width < 576 ? 'small' : 'middle'}>
                <Button
                  type="default"
                  onClick={handleActivateAll}
                  loading={activateAllMutation.isPending}
                  size={width < 576 ? 'small' : 'middle'}
                  icon={<PlayCircleOutlined />}
                >
                  {width < 768 ? 'Aktiv et' : 'Hamısını aktiv et'}
                </Button>
                <Button
                  type="primary"
                  onClick={handleFetchUmico}
                  loading={fetchUmicoMutation.isPending}
                  size={width < 576 ? 'small' : 'middle'}
                  icon={<SyncOutlined />}
                >
                  Yenilə
                </Button>
              </Space>
            </div>
          </div>
        }
        className={styles.productsCard}
      >
        <div className={styles.searchSection}>
          <Space.Compact className={styles.searchContainer}>
            <Input
              placeholder="Məhsul adı ilə axtarış..."
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
              {(activeToBotFilter !== undefined ||
                isActiveFilter !== undefined ||
                mpPriceBelowMinFilter !== undefined ||
                ordering) && (
                <span className={styles.activeFiltersIndicator}>
                  {
                    [
                      activeToBotFilter !== undefined && 'Bot',
                      isActiveFilter !== undefined && 'Məhsul',
                      mpPriceBelowMinFilter !== undefined && 'MP',
                      ordering && 'Sort',
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
            dataSource={products?.results}
            rowKey="id"
            loading={isLoading}
            pagination={getPaginationConfig()}
            className={styles.productsTable}
            scroll={{ x: 1000 }}
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
            <div className={styles.filterLabel}>Bot Statusu</div>
            <Radio.Group
              value={activeToBotFilter}
              onChange={(e) => handleBotActiveFilterChange(e.target.value)}
              buttonStyle="solid"
              size="middle"
              className={styles.radioGroup}
            >
              <Radio.Button value={undefined}>Hamısı</Radio.Button>
              <Radio.Button value={true}>Aktiv</Radio.Button>
              <Radio.Button value={false}>Deaktiv</Radio.Button>
            </Radio.Group>
          </div>

          <Divider className={styles.filterDivider} />

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Məhsul Statusu</div>
            <Radio.Group
              value={isActiveFilter}
              onChange={(e) => handleProductActiveFilterChange(e.target.value)}
              buttonStyle="solid"
              size="middle"
              className={styles.radioGroup}
            >
              <Radio.Button value={undefined}>Hamısı</Radio.Button>
              <Radio.Button value={true}>Aktiv</Radio.Button>
              <Radio.Button value={false}>Deaktiv</Radio.Button>
            </Radio.Group>
          </div>

          <Divider className={styles.filterDivider} />

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Qiymət Vəziyyəti</div>
            <Radio.Group
              value={mpPriceBelowMinFilter}
              onChange={(e) => handleMpPriceFilterChange(e.target.value)}
              buttonStyle="solid"
              size="middle"
              className={styles.radioGroup}
            >
              <Radio.Button value={undefined}>Hamısı</Radio.Button>
              <Radio.Button value={true}>MP minimum altında</Radio.Button>
            </Radio.Group>
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

      <UpdateModal
        visible={isModalVisible}
        onClose={handleModalClose}
        product={selectedProduct}
        onUpdate={handleUpdate}
        loading={updateMutation.isPending}
      />
      <ActivateModal
        visible={activateModalVisible}
        onClose={handleActivateModalClose}
        product={selectedProduct}
        onUpdate={handleActivate}
        loading={
          activateProductMutation.isPending ||
          deactivateProductMutation.isPending
        }
      />
    </div>
  );
};

export default Products;
