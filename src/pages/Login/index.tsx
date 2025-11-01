import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginMutation, type LoginRequest } from '../../api/login';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loginMutation = useLoginMutation(messageApi);

  const handleSubmit = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {contextHolder}
      <Card title="Xoş gəlmisiniz" style={{ width: 400 }}>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'İstifadəçi adınızı daxil edin!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="İstifadəçi adı" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Şifrənizi daxil edin!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Şifrə" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              block
            >
              {loginMutation.isPending ? 'Giriş edilir...' : 'Giriş'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
