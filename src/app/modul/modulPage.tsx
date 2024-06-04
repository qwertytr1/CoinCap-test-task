import { Button, Modal } from 'antd';
import React from 'react';
import { CurrencyEntity } from '../interfaces';

interface PortfolioModalProps {
  visible: boolean;
  onClose: () => void;
  portfolio: CurrencyEntity[];
  onDelete: (id: string) => void;
  cryptoRates: CurrencyEntity[];
  onPortfolioUpdate: (updatedPortfolio: CurrencyEntity[]) => void; // Добавляем новый колбэк для обновления портфолио
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ visible, onClose, portfolio, onDelete, cryptoRates, onPortfolioUpdate }) => {
  const handleDelete = (id: string) => {
    onDelete(id);
    const updatedPortfolio = portfolio.filter(coin => coin.id !== id);
    onPortfolioUpdate(updatedPortfolio); // Вызываем колбэк для обновления портфолио
  };

  return (
    <Modal
      title="Портфолио пользователя"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>
      ]}
    >
      <ul>
        {portfolio.map((coin) => (
          <li key={coin.id}>
            {coin.name} ({coin.symbol}) - {coin.priceUsd} USD
            <Button type="link" onClick={() => handleDelete(coin.id)}>Удалить</Button>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default PortfolioModal;
