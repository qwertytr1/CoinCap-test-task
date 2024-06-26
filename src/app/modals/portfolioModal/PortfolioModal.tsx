  import React from 'react';
  import { Button, Table, Modal, Typography } from 'antd';
  import { CurrencyEntity } from '../../interfaces';
  import './PortfolioModal.scss';
import { usePortfolio } from 'app/context/PortfolioContext';

  const { Text } = Typography;

  const PortfolioModal: React.FC = () => {
    const { portfolio, portfolioVisible, portfolioCostDifference,handleClosePortfolio, handleDeleteCoin } = usePortfolio();
    const handleGoBack = () => {
      handleClosePortfolio();


  };
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
        className: 'hide-on-mobile',
      },
      {
        title: 'Цена в USD',
        dataIndex: 'priceUsd',
        key: 'priceUsd',
        render: (text: string, record: CurrencyEntity) => (
          <span>${(parseFloat(record.priceUsd) * (record.quantity || 0)).toFixed(2)}</span>
        ),
        className: 'hide-on-smallest',
      },
      {
        title: 'Количество',
        dataIndex: 'quantity',
        key: 'quantity',
        className: 'hide-on-mobile',
      },
      {
        title: 'Действие',
        key: 'action',
        render: (record: CurrencyEntity) => (
          <Button type="link" onClick={() => handleDeleteCoin(record.id)}>Удалить</Button>
        ),
      },
    ];

    return (
      <Modal
        title="Портфолио пользователя"
        visible={portfolioVisible}
        onCancel={handleGoBack}
        footer={[
          <Button key="close" onClick={handleGoBack} >Закрыть</Button>,
        ]}
        width={800}
      >
        <Table
          dataSource={portfolio}
          columns={columns}
          rowKey="id"
          footer={() => (
            <Text strong>Общая сумма портфеля: ${portfolioCostDifference.toFixed(2)}</Text>
          )}
        />
      </Modal>
    );
  };

  export default PortfolioModal;
