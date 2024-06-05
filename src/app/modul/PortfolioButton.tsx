import React from 'react';
import { Button } from 'antd';
import { CurrencyEntity } from '../interfaces';

interface PortfolioButtonProps {
  cryptoRates: CurrencyEntity[];
  onOpenPortfolio: () => void;
}

const PortfolioButton: React.FC<PortfolioButtonProps> = ({ cryptoRates, onOpenPortfolio }) => {
  return (
    <div>
      <Button onClick={onOpenPortfolio}>Открыть портфель</Button>
    </div>
  );
};

export default PortfolioButton;
