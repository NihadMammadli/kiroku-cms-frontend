import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputNumber } from 'antd';
import type { Product } from '../../../api/products';
import styles from '../modals.module.scss';

interface ActivateModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (
    productId: string,
    oldPrice: number,
    retailPrice: number,
    qty: number
  ) => void;
  loading?: boolean;
}

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

const ActivateModal: React.FC<ActivateModalProps> = ({
  visible,
  onClose,
  product,
  onUpdate,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const { width } = useWindowSize();

  useEffect(() => {
    if (product) {
      const decreasedPrice = product.min_price * 0.9;
      form.setFieldsValue({
        minPrice: parseFloat(decreasedPrice.toFixed(2)),
      });
    }
  }, [product, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (product) {
        onUpdate(
          product.offer_id,
          values.oldPrice,
          values.retailPrice,
          values.qty
        );
      }
    } catch (error) {
      console.error('Doğrulama alınmadı:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Reset form when modal closes (for both cancel and successful activation)
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  // Responsive modal configuration
  const getModalConfig = () => {
    const isMobile = width < 576;
    const isTablet = width < 768;

    return {
      width: isMobile ? '95%' : isTablet ? 400 : 500,
      style: isMobile ? { top: 20 } : undefined,
      centered: !isMobile,
    };
  };

  return (
    <Modal
      title={width < 576 ? 'Məhsul aktiv et' : 'Məhsulu aktivləşdir'}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key="cancel"
          onClick={handleCancel}
          size={width < 576 ? 'small' : 'middle'}
        >
          Ləğv et
        </Button>,
        <Button
          key="update"
          type="primary"
          loading={loading}
          onClick={handleUpdate}
          size={width < 576 ? 'small' : 'middle'}
        >
          Aktiv et
        </Button>,
      ]}
      {...getModalConfig()}
      className="product-modal"
    >
      {product && (
        <div>
          <Form
            form={form}
            layout="vertical"
            size={width < 576 ? 'small' : 'middle'}
          >
            <Form.Item
              label="Cari minimum qiymət"
              name="oldPrice"
              rules={[
                { required: true, message: 'Cari minimum qiymət daxil edin' },
                {
                  type: 'number',
                  min: 0,
                  message:
                    'Cari minimum qiymət 0-dan böyük və ya bərabər olmalıdır',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                prefix="₼"
                placeholder="Cari minimum qiymət daxil edin"
                min={0}
                precision={2}
                step={0.01}
              />
            </Form.Item>
            <Form.Item
              label="Endirimli qiymət"
              name="retailPrice"
              rules={[
                { required: true, message: 'Endirimli qiymət daxil edin' },
                {
                  type: 'number',
                  min: 0,
                  message:
                    'Endirimli qiymət 0-dan böyük və ya bərabər olmalıdır',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                prefix="₼"
                placeholder="Endirimli qiymət daxil edin"
                min={0}
                precision={2}
                step={0.01}
              />
            </Form.Item>
            <Form.Item
              label="Məhsulun sayı"
              name="qty"
              rules={[
                { required: true, message: 'Məhsulun sayı daxil edin' },
                {
                  type: 'number',
                  min: 0,
                  message: 'Məhsulun sayı 0-dan böyük və ya bərabər olmalıdır',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Məhsulun sayı daxil edin"
                min={0}
                step={1}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default ActivateModal;
