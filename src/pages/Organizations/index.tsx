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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader, FilterPanel } from '../../components/custom';
import { Table, Input, Button, Checkbox } from '../../components/restyled';
import {
  useOrganizationsQuery,
  useCreateOrganizationMutation,
  usePartialUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  type Organization,
  type OrganizationCreate,
} from '../../api';
import styles from './Organizations.module.css';

const Organizations: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>();
  const [isActiveFilterStr, setIsActiveFilterStr] = useState<
    string | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [form] = Form.useForm();

  // Queries and mutations
  const {
    data: organizations,
    isLoading,
    error,
  } = useOrganizationsQuery({
    search: searchTerm || undefined,
    is_active: isActiveFilter,
  });

  const createMutation = useCreateOrganizationMutation(messageApi);
  const updateMutation = usePartialUpdateOrganizationMutation(messageApi);
  const deleteMutation = useDeleteOrganizationMutation(messageApi);

  const handleCreate = () => {
    setEditingOrg(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Organization) => {
    setEditingOrg(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrg) {
        updateMutation.mutate(
          { id: editingOrg.id, data: values },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(values as OrganizationCreate, {
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
    setEditingOrg(null);
  };

  const columns = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Organization, b: Organization) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => text || '-',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (text: string) => text || '-',
    },
    {
      title: 'Şəhər',
      dataIndex: 'city',
      key: 'city',
      render: (text: string) => text || '-',
    },
    {
      title: 'Ölkə',
      dataIndex: 'country',
      key: 'country',
      render: (text: string) => text || '-',
    },
    {
      title: 'Filiallar',
      dataIndex: 'branch_count',
      key: 'branch_count',
    },
    {
      title: 'Tələbələr',
      dataIndex: 'total_students',
      key: 'total_students',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'success' : 'error'}>
          {is_active ? 'Aktiv' : 'Deaktiv'}
        </Tag>
      ),
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: unknown, record: Organization) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Təşkilatı silmək istədiyinizdən əminsiniz?"
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
          description="Təşkilatları yükləmək mümkün olmadı"
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
        title="Təşkilatlar"
        actions={[
          {
            label: 'Yeni Təşkilat',
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
            onChange: (value) => setSearchTerm((value as string) || ''),
          },
          is_active: {
            type: 'select',
            placeholder: 'Status',
            value: isActiveFilterStr,
            onChange: (value) => {
              const strValue = value as string | undefined;
              setIsActiveFilterStr(strValue);
              if (strValue === 'true') setIsActiveFilter(true);
              else if (strValue === 'false') setIsActiveFilter(false);
              else setIsActiveFilter(undefined);
            },
            options: [
              { label: 'Aktiv', value: 'true' },
              { label: 'Deaktiv', value: 'false' },
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
            dataSource={organizations}
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
        title={editingOrg ? 'Təşkilatı Redaktə Et' : 'Yeni Təşkilat'}
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
            name="name"
            label="Ad"
            rules={[{ required: true, message: 'Ad daxil edin' }]}
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
          <Form.Item name="description" label="Təsvir">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Düzgün email daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Telefon">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Veb sayt">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Ünvan">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="city" label="Şəhər">
            <Input />
          </Form.Item>
          <Form.Item name="state" label="Ştat/Rayon">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Ölkə">
            <Input />
          </Form.Item>
          <Form.Item name="postal_code" label="Poçt kodu">
            <Input />
          </Form.Item>
          <Form.Item
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Aktiv</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Organizations;
