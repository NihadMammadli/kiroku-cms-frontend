import React, { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Alert,
  Popconfirm,
  Tag,
  Space,
  InputNumber,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageHeader, FilterPanel } from '../../components/custom';
import { Table, Input, Select, Button } from '../../components/restyled';
import {
  useCourseGroupsQuery,
  useCreateCourseGroupMutation,
  useUpdateCourseGroupMutation,
  useDeleteCourseGroupMutation,
  useCoursesQuery,
  type CourseGroup,
  type CourseGroupCreate,
  type CourseGroupStatus,
} from '../../api';
import styles from './CourseGroups.module.css';

const CourseGroups: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    CourseGroupStatus | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CourseGroup | null>(null);
  const [form] = Form.useForm();

  // Queries and mutations
  const {
    data: groups,
    isLoading,
    error,
  } = useCourseGroupsQuery({
    search: searchTerm || undefined,
    status: statusFilter,
  });

  const { data: courses } = useCoursesQuery({ status: 'PUBLISHED' });

  const createMutation = useCreateCourseGroupMutation(messageApi);
  const updateMutation = useUpdateCourseGroupMutation(messageApi);
  const deleteMutation = useDeleteCourseGroupMutation(messageApi);

  const handleCreate = () => {
    setEditingGroup(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: CourseGroup) => {
    setEditingGroup(record);
    form.setFieldsValue({
      ...record,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        start_date: values.start_date
          ? values.start_date.format('YYYY-MM-DD')
          : undefined,
        end_date: values.end_date
          ? values.end_date.format('YYYY-MM-DD')
          : undefined,
      };

      if (editingGroup) {
        updateMutation.mutate(
          { id: editingGroup.id, data: formData },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(formData as CourseGroupCreate, {
          onSuccess: () => {
            setModalVisible(false);
            form.resetFields();
          },
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingGroup(null);
  };

  const statusLabels: Record<CourseGroupStatus, string> = {
    UPCOMING: 'Gələcək',
    ACTIVE: 'Aktiv',
    COMPLETED: 'Tamamlanıb',
    CANCELLED: 'Ləğv edilib',
  };

  const statusColors: Record<CourseGroupStatus, string> = {
    UPCOMING: 'blue',
    ACTIVE: 'success',
    COMPLETED: 'default',
    CANCELLED: 'error',
  };

  const columns = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: CourseGroup, b: CourseGroup) => a.name.localeCompare(b.name),
    },
    {
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Kurs',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Müəllim',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
      render: (text: string) => text || '-',
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
          {record.is_full && (
            <Tag color="warning" style={{ marginLeft: 8 }}>
              Dolu
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: 'Aylıq qiymət',
      dataIndex: 'monthly_price',
      key: 'monthly_price',
      render: (price: string) => `${price} AZN`,
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
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: unknown, record: CourseGroup) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Qrupu silmək istədiyinizdən əminsiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Bəli"
            cancelText="Xeyr"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
        title="Kurs Qrupları"
        actions={[
          {
            label: 'Yeni Qrup',
            icon: <PlusOutlined />,
            onClick: handleCreate,
            type: 'primary',
          },
        ]}
      />

      <FilterPanel
        filters={{
          search: {
            type: 'input',
            placeholder: 'Axtar...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          status: {
            type: 'select',
            placeholder: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
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
            dataSource={groups}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1400 }}
          />
        )}
      </div>

      <Modal
        title={editingGroup ? 'Qrupu Redaktə Et' : 'Yeni Qrup'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={800}
      >
        <Form form={form} layout="vertical" className={styles.form}>
          <Form.Item
            name="course"
            label="Kurs"
            rules={[{ required: true, message: 'Kurs seçin' }]}
          >
            <Select
              options={courses?.map((course) => ({
                label: course.name,
                value: course.id,
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Qrup adı"
            rules={[{ required: true, message: 'Qrup adı daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Kod"
            rules={[{ required: true, message: 'Kod daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="max_students"
            label="Maksimum tələbə sayı"
            rules={[
              { required: true, message: 'Maksimum tələbə sayı daxil edin' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="monthly_price"
            label="Aylıq qiymət"
            rules={[{ required: true, message: 'Aylıq qiymət daxil edin' }]}
          >
            <Input type="number" step="0.01" min={0} />
          </Form.Item>
          <Form.Item
            name="annual_price"
            label="İllik qiymət"
            rules={[{ required: true, message: 'İllik qiymət daxil edin' }]}
          >
            <Input type="number" step="0.01" min={0} />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Başlama tarixi"
            rules={[{ required: true, message: 'Başlama tarixi seçin' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Bitmə tarixi"
            rules={[{ required: true, message: 'Bitmə tarixi seçin' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="UPCOMING">
            <Select
              options={[
                { label: 'Gələcək', value: 'UPCOMING' },
                { label: 'Aktiv', value: 'ACTIVE' },
                { label: 'Tamamlanıb', value: 'COMPLETED' },
                { label: 'Ləğv edilib', value: 'CANCELLED' },
              ]}
            />
          </Form.Item>
          <Form.Item name="notes" label="Qeydlər">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseGroups;
