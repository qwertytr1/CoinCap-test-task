import React, { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { usePortfolio } from 'app/context/PortfolioContext';

const AddCoinsModal: React.FC = () => {
  const [coinQuantities, setCoinQuantities] = useState<{ [key: string]: number }>({});
  const {
    addCoinsModalVisible,
    handleCloseAddCoinsModal,
    coinForAdd,
    handleAddToPortfolio
  } = usePortfolio();

  const handleAddCoins = () => {
    if (coinForAdd && coinQuantities[coinForAdd.id] > 0) {
      const selectedCoin = { ...coinForAdd, quantity: coinQuantities[coinForAdd.id] || 0 };
      handleAddToPortfolio([selectedCoin]);
      setCoinQuantities({});
      handleCloseAddCoinsModal();
    }
  };

  const handleQuantityChange = (coinId: string, value: number | null) => {
    setCoinQuantities(prev => ({
      ...prev,
      [coinId]: value || 0,
    }));
  };

  return (
    <Modal
      title="Добавление монет"
      visible={addCoinsModalVisible}
      onCancel={handleCloseAddCoinsModal}
      footer={[
        <Button key="cancel" onClick={handleCloseAddCoinsModal}>Отмена</Button>,
        <Button key="add" type="primary" onClick={handleAddCoins}>Добавить</Button>,
      ]}
    >
      {coinForAdd && (
        <div key={coinForAdd.id}>
          <p>{coinForAdd.name} ({coinForAdd.symbol}) - {coinForAdd.priceUsd}</p>
          <InputNumber
            min={0}
            value={coinQuantities[coinForAdd.id] || 0}
            onChange={value => handleQuantityChange(coinForAdd.id, value)}
          />
          <p>Сумма: {((coinQuantities[coinForAdd.id] || 0) * parseFloat(coinForAdd.priceUsd)).toFixed(2)}</p>
        </div>
      )}
    </Modal>
  );
};

export default AddCoinsModal;
