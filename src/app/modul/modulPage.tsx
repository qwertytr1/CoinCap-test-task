import React from 'react';
import { Button, Table, Modal, Typography } from 'antd'; // Импорт Typography из Ant Design
import { CurrencyEntity } from '../interfaces';

interface PortfolioModalProps {
  visible: boolean;
  onClose: () => void;
  portfolio: CurrencyEntity[];
  onDelete: (id: string) => void;
}

const { Text } = Typography; // Деструктурируем Text из Typography

const PortfolioModal: React.FC<PortfolioModalProps> = ({ visible, onClose, portfolio, onDelete }) => {
  // Функция для вычисления общей суммы портфеля
  const totalPortfolioValue = portfolio.reduce((acc, coin) => acc + parseFloat(coin.priceUsd), 0);

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Символ',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Цена в USD',
      dataIndex: 'priceUsd',
      key: 'priceUsd',
    },
    {
      title: 'Действие',
      key: 'action',
      render: (record: CurrencyEntity) => (
        <Button type="link" onClick={() => onDelete(record.id)}>Удалить</Button>
      ),
    },
  ];

  return (
    <Modal
      title="Портфолио пользователя"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Закрыть</Button>,
      ]}
      width={800} // Установка ширины модального окна
    >
      {/* Добавляем новую строку для отображения общей суммы портфеля */}
      <Table
        dataSource={portfolio}
        columns={columns}
        rowKey="id"
        footer={() => (
          <Text strong>Общая сумма портфеля: ${totalPortfolioValue.toFixed(2)}</Text>
        )}
      />
    </Modal>
  );
};

export default PortfolioModal;