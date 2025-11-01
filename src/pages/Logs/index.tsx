import React, { useState, useEffect } from "react";
import { Table, Card, Input, Button, Space } from "antd";
import { SearchOutlined, ClearOutlined, FileExcelOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useLogsQuery, useExportLogsMutation } from "../../mutations/logs";
import type { Log } from "../../api/logs";
import styles from "./index.module.scss";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
};

const Logs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { width } = useWindowSize();

  const { data: logs, isLoading, error } = useLogsQuery(page, searchTerm, pageSize);
  const exportMutation = useExportLogsMutation();

  if (error) {
    return (
      <div className={styles.logsContainer}>
        <Card className={styles.logsCard}>
          <div className={styles.errorMessage}>
            Logları yükləmədə xəta: {(error as Error).message}
          </div>
        </Card>
      </div>
    );
  }

  const columns: ColumnsType<Log> = [
    {
      title: "Məhsul adı",
      dataIndex: "product_name",
      key: "product_name",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Köhnə qiymət",
      dataIndex: "old_price",
      key: "old_price",
      width: 110,
    },
    {
      title: "Yeni qiymət",
      dataIndex: "new_price",
      key: "new_price",
      width: 110,
    },
    {
      title: "Qənaət",
      dataIndex: "savings",
      key: "savings",
      width: 90,
    },
    {
      title: "Tarix",
      dataIndex: "changed_at",
      key: "changed_at",
      width: 140,
      render: (text: string) => new Date(text).toLocaleString("az-AZ"),
    },
    {
      title: "Fərq",
      dataIndex: "price_difference",
      key: "price_difference",
      width: 100,
    },
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleShowSizeChange = (_current: number, size: number) => {
    setPageSize(size);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSearch = () => {
    setSearchTerm(searchValue);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchTerm("");
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Responsive pagination configuration
  const getPaginationConfig = () => {
    const isMobile = width < 576;
    const isTablet = width < 768;

    return {
      current: page,
      total: logs?.count || 0,
      pageSize: pageSize,
      onChange: handlePageChange,
      showTotal: isMobile
        ? undefined
        : (total: number, range: [number, number]) => `${range[0]}-${range[1]} dən ${total} log`,
      showSizeChanger: true,
      onShowSizeChange: handleShowSizeChange,
      pageSizeOptions: ["10", "20", "50", "100"],
      responsive: true,
      simple: isMobile,
      showQuickJumper: !isTablet,
      showLessItems: isMobile,
      size: (isMobile ? "small" : "default") as "small" | "default",
      className: styles.pagination,
      locale: {
        jump_to: "Keç",
        jump_to_confirm: "təsdiq et",
        page: "",
        prev_page: "Əvvəlki səhifə",
        next_page: "Növbəti səhifə",
        prev_5: "Əvvəlki 5 səhifə",
        next_5: "Növbəti 5 səhifə",
        prev_3: "Əvvəlki 3 səhifə",
        next_3: "Növbəti 3 səhifə",
        items_per_page: "/ səhifə",
      },
    };
  };

  const handleExportToExcel = async () => {
    try {
      const blob = await exportMutation.mutateAsync();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.download = `qiymet_deyisiklik_loglari_${currentDate}.xlsx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel export failed:', error);
      // You might want to show a notification here
    }
  };

  return (
    <div className={styles.logsContainer}>
      <Card className={styles.logsCard} bordered={false}>
        <div className={styles.logsHeader}>
          <div className={styles.titleSection}>
            <h2>Loglar</h2>
          </div>

          <div className={styles.actionsSection}>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={handleExportToExcel}
              loading={exportMutation.isPending}
              disabled={exportMutation.isPending}
            >
              {width < 576 ? 'Endir' : 'Excel-ə endir'}
            </Button>
          </div>
        </div>

        <div className={styles.searchSection}>
          <Space.Compact className={styles.searchContainer}>
            <Input
              placeholder="Mesajda axtarış..."
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

        <div className={styles.tableWrapper}>
          <Table
            dataSource={logs?.results || []}
            columns={columns}
            loading={isLoading}
            pagination={getPaginationConfig()}
            rowKey="id"
            size="small"
            scroll={{ x: 800 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Logs;
