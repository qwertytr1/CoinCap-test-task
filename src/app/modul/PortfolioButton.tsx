import React from 'react';
import { Button } from 'antd';
import { CurrencyEntity } from '../interfaces';

interface PortfolioButtonProps {
  cryptoRates: CurrencyEntity[];
  onAddToPortfolio: (coinId: string) => void;
  onOpenAddCoinsModal: () => void; // Добавляем onOpenAddCoinsModal в пропсы
}

const PortfolioButton: React.FC<PortfolioButtonProps> = ({ cryptoRates, onAddToPortfolio, onOpenAddCoinsModal }) => {
  return (
    <div>
      <Button onClick={onOpenAddCoinsModal}>Добавить в портфель</Button>
    </div>
  );
};

export default PortfolioButton;