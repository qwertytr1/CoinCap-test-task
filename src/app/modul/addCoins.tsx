import React, { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { CurrencyEntity } from '../interfaces';

interface AddCoinsModalProps {
    open: boolean;
    onClose: () => void;
    coins: CurrencyEntity[];
    onAddCoins: (selectedCoins: CurrencyEntity[]) => void;
}

const AddCoinsModal: React.FC<AddCoinsModalProps> = ({ open, onClose, coins, onAddCoins }) => {
    const [coinQuantities, setCoinQuantities] = useState<{ [key: string]: number }>({});

    const handleAddCoins = () => {
        // Фильтруем выбранные монеты, оставляем только те, у которых количество больше 0
        const selectedCoins = coins.filter(coin => coinQuantities[coin.id] > 0);
        // Вызываем обработчик для добавления монет в портфель для каждой выбранной монеты
        selectedCoins.forEach(coin => {
            onAddCoins([coin]); // Calling onAddCoins with an array containing a single coin
        });
        // Очищаем состояние количества монет
        setCoinQuantities({});
        // Закрываем модальное окно
        onClose();
    };
    return (
        <Modal
            title="Добавление монет"
            visible={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Отмена</Button>,
                <Button key="add" type="primary" onClick={handleAddCoins}>Добавить</Button>,
            ]}
        >
            <div>
                {/* Для каждой монеты в списке выводим соответствующее поле для ввода количества */}
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