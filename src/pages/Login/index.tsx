import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginMutation } from '../../mutations';
import type { LoginRequest } from '../../api/auth';
import styles from './index.module.scss';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loginMutation = useLoginMutation(messageApi);

  const handleSubmit = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  return (
    <div className={styles.loginContainer}>
      {contextHolder}
      <div className={styles.loginWrapper}>
        <Card
          title={
            <div className={styles.loginTitle}>
              <div className={styles.logoSection}>
                <div className={styles.logo}>uBot</div>
              </div>
              <div className={styles.welcomeText}>Xoş gəlmisiniz</div>
            </div>
          }
          className={styles.loginCard}
        >
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
            layout="vertical"
            className={styles.loginForm}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'İstifadəçi adınızı daxil edin!' },
              ]}
              className={styles.formItem}
            >
              <Input
                prefix={<UserOutlined className={styles.inputIcon} />}
                placeholder="İstifadəçi adı"
                className={styles.formInput}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Şifrənizi daxil edin!' }]}
              className={styles.formItem}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="Şifrə"
                className={styles.formInput}
              />
            </Form.Item>

            <Form.Item className={styles.submitItem}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loginMutation.isPending}
                className={styles.formButton}
                block
              >
                {loginMutation.isPending ? 'Giriş edilir...' : 'Giriş'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
