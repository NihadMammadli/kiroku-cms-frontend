import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputNumber } from 'antd';
import type { Product } from '../../../api/products';
import styles from '../modals.module.scss';

interface UpdateModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (productId: string, newMinPrice: number) => void;
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

const UpdateModal: React.FC<UpdateModalProps> = ({
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
        onUpdate(product.id, values.minPrice);
      }
    } catch (error) {
      console.error('Doğrulama alınmadı:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

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
      title={
        width < 576 ? 'Qiymət yenilə' : 'Məhsulun minimum qiymətini yenilə'
      }
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
          Yenilə
        </Button>,
      ]}
      {...getModalConfig()}
      className="product-modal"
    >
      {product && (
        <div>
          <div className={styles.productInfo}>
            <div className={styles.infoTitle}>Məhsul məlumatları</div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ad</span>
              <span className={styles.infoValue}>{product.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Qiymət</span>
              <span className={styles.infoValue}>₼{product.price}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Endirimli qiymət</span>
              <span className={styles.infoValue}>₼{product.retail_price}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Cari minimum qiymət</span>
              <span className={styles.infoValue}>₼{product.min_price}</span>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            size={width < 576 ? 'small' : 'middle'}
          >
            <Form.Item
              label="Yeni minimum qiymət"
              name="minPrice"
              rules={[
                { required: true, message: 'Minimum qiymət daxil edin' },
                {
                  type: 'number',
                  min: 0,
                  message: 'Minimum qiymət 0-dan böyük və ya bərabər olmalıdır',
                },
              ]}
            >
              <InputNumber
                style={{
                  width: '100%',
                }}
                prefix="₼"
                placeholder="Yeni minimum qiymət daxil edin"
                min={0}
                precision={2}
                step={0.01}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default UpdateModal;
