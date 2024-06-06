import React, { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { CurrencyEntity } from '../interfaces';
import styles from './AddCoinsModal.module.scss';

interface AddCoinsModalProps {
    open: boolean;
    onClose: () => void;
    coins: CurrencyEntity[];
    onAddCoins: (selectedCoins: CurrencyEntity[], quantities: { [key: string]: number }) => void;
}

const AddCoinsModal: React.FC<AddCoinsModalProps> = ({ open, onClose, coins, onAddCoins }) => {
    const [coinQuantities, setCoinQuantities] = useState<{ [key: string]: number }>({});

    const handleAddCoins = () => {
        const selectedCoins = coins.filter(coin => coinQuantities[coin.id] > 0);
        console.log("Selected coins to add:", selectedCoins);
        console.log("Quantities:", coinQuantities);
        onAddCoins(selectedCoins, coinQuantities); // Передаем выбранные монеты и их количество
        setCoinQuantities({});
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
                {coins.map(coin => (
                    <div key={coin.id}>
                        <p>{coin.name} ({coin.symbol}) - {coin.priceUsd}</p>
                        <InputNumber
                            min={0}
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
