import React, { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { CurrencyEntity } from '../interfaces';

interface AddCoinsModalProps {
    open: boolean;
    onClose: () => void;
    coins: CurrencyEntity[];
    onAddCoins: (coins: CurrencyEntity[], quantity: number) => void;
}


const AddCoinsModal: React.FC<AddCoinsModalProps> = ({ open, onClose, coins, onAddCoins }) => {
  const [quantity, setQuantity] = useState<number>(0);

  const handleAddCoin = () => {
    if (coins.length > 0 && quantity > 0) {
        onAddCoins(coins, quantity);
        setQuantity(0);
        onClose();
    }
};


  return (
    <Modal
      title="Добавление монеты"
      visible={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Отмена</Button>,
        <Button key="add" type="primary" onClick={handleAddCoin} disabled={quantity <= 0}>Добавить</Button>,
      ]}
    >
{coins.map((coin, index) => (
    <div key={index}>
        <p>{coin.name} ({coin.symbol}) - Цена: ${coin.priceUsd}</p>
        <InputNumber
            min={0}
            value={quantity}
            onChange={(value: number | null) => setQuantity(value || 0)}
        />
        <p>Сумма: ${(quantity * parseFloat(coin.priceUsd)).toFixed(2)}</p>
    </div>
))}
    </Modal>
  );
};

export default AddCoinsModal;
