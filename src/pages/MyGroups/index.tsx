import React, { useState } from 'react';
import { message, Spin, Alert, Tag, Card, Row, Col } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { PageHeader, FilterPanel } from '../../components/custom';
import { Table } from '../../components/restyled';
import {
  useMyCourseGroupsQuery,
  useCurrentUserQuery,
  type CourseGroup,
  type CourseGroupStatus,
} from '../../api';
import { UserRoles } from '../../utils/permissions';
import styles from './MyGroups.module.css';

const MyGroups: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    CourseGroupStatus | undefined
  >();

  const { data: user } = useCurrentUserQuery();
  const { data: groups, isLoading, error } = useMyCourseGroupsQuery();

  const statusLabels: Record<CourseGroupStatus, string> = {
    UPCOMING: 'Gələcək',
    ACTIVE: 'Aktiv',
    COMPLETED: 'Tamamlanıb',
    CANCELLED: 'Ləğv edilib',
  };

  const statusColors: Record<CourseGroupStatus, string> = {
    UPCOMING: 'default',
    ACTIVE: 'success',
    COMPLETED: 'blue',
    CANCELLED: 'error',
  };

  const filteredGroups = groups?.filter((group) => {
    const matchesSearch =
      !searchTerm ||
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || group.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Columns for teachers
  const teacherColumns = [
    {
      title: 'Kurs',
      dataIndex: 'course_name',
      key: 'course_name',
      sorter: (a: CourseGroup, b: CourseGroup) =>
        a.course_name.localeCompare(b.course_name),
    },
    {
      title: 'Qrup',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: CourseGroupStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Cədvəl',
      dataIndex: 'schedule_display',
      key: 'schedule_display',
    },
    {
      title: 'Tələbələr',
      key: 'students',
      render: (_: unknown, record: CourseGroup) => (
        <span>
          {record.enrolled_count} / {record.max_students}
          {record.is_full && <Tag color="red">Dolu</Tag>}
        </span>
      ),
    },
    {
      title: 'Başlama',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
    {
      title: 'Bitmə',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
  ];

  // Columns for students (hide pricing info)
  const studentColumns = [
    {
      title: 'Kurs',
      dataIndex: 'course_name',
      key: 'course_name',
      sorter: (a: CourseGroup, b: CourseGroup) =>
        a.course_name.localeCompare(b.course_name),
    },
    {
      title: 'Qrup',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Müəllim',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: CourseGroupStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Cədvəl',
      dataIndex: 'schedule_display',
      key: 'schedule_display',
    },
    {
      title: 'Başlama',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
    {
      title: 'Bitmə',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
  ];

  const columns =
    user?.user_type === UserRoles.TEACHER ? teacherColumns : studentColumns;

  if (error) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="Qrupları yükləmək mümkün olmadı"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <PageHeader
        title={
          user?.user_type === UserRoles.TEACHER
            ? 'Mənim Dərs Verdiyim Qruplar'
            : 'Mənim Qruplarım'
        }
      />

      {/* Summary Cards */}
      <Row gutter={16} className={styles.summaryCards}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <BookOutlined className={styles.statIcon} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>{groups?.length || 0}</div>
                <div className={styles.statLabel}>Ümumi Qruplar</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <CalendarOutlined
                className={styles.statIcon}
                style={{ color: '#52c41a' }}
              />
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {groups?.filter((g) => g.status === 'ACTIVE').length || 0}
                </div>
                <div className={styles.statLabel}>Aktiv Qruplar</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <UserOutlined
                className={styles.statIcon}
                style={{ color: '#1890ff' }}
              />
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {groups?.reduce((sum, g) => sum + g.enrolled_count, 0) || 0}
                </div>
                <div className={styles.statLabel}>
                  {user?.user_type === UserRoles.TEACHER
                    ? 'Ümumi Tələbələr'
                    : 'Həmsiniflərim'}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <BookOutlined
                className={styles.statIcon}
                style={{ color: '#faad14' }}
              />
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {groups?.filter((g) => g.status === 'UPCOMING').length || 0}
                </div>
                <div className={styles.statLabel}>Gələcək Qruplar</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <FilterPanel
        filters={{
          search: {
            type: 'input',
            placeholder: 'Axtar...',
            value: searchTerm,
            onChange: (value) => setSearchTerm((value as string) || ''),
          },
          status: {
            type: 'select',
            placeholder: 'Status',
            value: statusFilter,
            onChange: (value) =>
              setStatusFilter(value as CourseGroupStatus | undefined),
            options: [
              { label: 'Gələcək', value: 'UPCOMING' },
              { label: 'Aktiv', value: 'ACTIVE' },
              { label: 'Tamamlanıb', value: 'COMPLETED' },
              { label: 'Ləğv edilib', value: 'CANCELLED' },
            ],
          },
        }}
      />

      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" tip="Yüklənir..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredGroups}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1200 }}
          />
        )}
      </div>
    </div>
  );
};

export default MyGroups;
