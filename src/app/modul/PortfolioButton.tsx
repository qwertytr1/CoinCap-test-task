import React from 'react';
import { Button } from 'antd';
import { CurrencyEntity } from '../interfaces';

interface PortfolioButtonProps {
  cryptoRates: CurrencyEntity[];
  onOpenAddCoinsModal: () => void;
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  onOpenPortfolio: () => void;
}

const PortfolioButton: React.FC<PortfolioButtonProps> = ({ cryptoRates, onOpenAddCoinsModal, onAddToPortfolio, onOpenPortfolio }) => {
  return (
    <div>
      <Button onClick={onOpenPortfolio}>Открыть портфель</Button>
    </div>
  );
};

export default PortfolioButton;