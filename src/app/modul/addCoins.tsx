import React, { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { CurrencyEntity } from '../interfaces';

interface AddCoinsModalProps {
  visible: boolean;
  onClose: () => void;
  coins: CurrencyEntity[];
  onAddCoins: (coins: CurrencyEntity[]) => void; // Обновляем проп
}

const AddCoinsModal: React.FC<AddCoinsModalProps> = ({ visible, onClose, coins, onAddCoins }) => {
  const [selectedCoins, setSelectedCoins] = useState<CurrencyEntity[]>([]); // Изменили тип на массив объектов
  const [coinQuantities, setCoinQuantities] = useState<{ [key: string]: number }>({});

  const handleAddCoins = () => {
    onAddCoins(selectedCoins); // Передаем выбранные монеты обратно в родительский компонент
    onClose();
  };

  return (
    <Modal
      title="Добавление монет"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="add" type="primary" onClick={handleAddCoins}>
          Добавить
        </Button>,
      ]}
    >
      <div>
        {coins.map(coin => (
          <div key={coin.id}>
            <p>{coin.name} ({coin.symbol}) - {coin.priceUsd}</p>
            <InputNumber
              min={0}
              defaultValue={0}
              value={coinQuantities[coin.id] || 0}
              onChange={value => {
                setCoinQuantities(prev => ({
                  ...prev,
                  [coin.id]: value || 0,
                }));
                setSelectedCoins(prev => {
                  const index = prev.findIndex(item => item.id === coin.id);
                  if (index !== -1) {
                    const updatedCoins = [...prev];
                    updatedCoins[index] = { ...coin, quantity: value || 0 };
                    return updatedCoins;
                  } else {
                    return [...prev, { ...coin, quantity: value || 0 }];
                  }
                });
              }}
            />
            <p>Сумма: {((coinQuantities[coin.id] || 0) * parseFloat(coin.priceUsd)).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AddCoinsModal;
