import React, { useEffect, useState } from 'react';
import { httpGet } from '../api/apiHandler';
import { CurrencyEntity } from '../interfaces';
import './Header.scss';


interface HeaderProps {
  portfolio: CurrencyEntity[];
  onOpenPortfolio: () => void;
  totalPortfolioValue: number;
}

const Header: React.FC<HeaderProps> = ({ portfolio, onOpenPortfolio, totalPortfolioValue }) => {
  const [cryptoRates, setCryptoRates] = useState<CurrencyEntity[]>([]);
  const [topThreeCryptos, setTopThreeCryptos] = useState<CurrencyEntity[]>([]);
  const [initialPortfolioValue, setInitialPortfolioValue] = useState<number>(0);


  useEffect(() => {
    const fetchCryptoRates = async () => {
      try {
        const response = await httpGet<{ data: CurrencyEntity[] }>('/assets');
        setCryptoRates(response.data.data);
      } catch (error) {
        console.error('Ошибка при получении данных о криптовалютах:', error);
      }
    };

    fetchCryptoRates();
  }, []);

  useEffect(() => {
    const initialValue = portfolio.reduce((acc, coin) => acc + (coin.purchasePrice * (coin.quantity || 0)), 0);
    setInitialPortfolioValue(initialValue);
  }, [portfolio]);

  useEffect(() => {
    if (cryptoRates.length > 0) {
      const sortedCryptoRates = [...cryptoRates].sort((a, b) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd));
      const topThree = sortedCryptoRates.slice(0, 3);
      setTopThreeCryptos(topThree);
    }
  }, [cryptoRates]);

  const portfolioChange = totalPortfolioValue - initialPortfolioValue;
  const portfolioChangePercentage = initialPortfolioValue !== 0 ? ((portfolioChange / initialPortfolioValue) * 100).toFixed(2) : '0.00';

  return (
    <div className="header">
      <div className="crypto-rates-container">
        <div className="crypto-rates">
          {topThreeCryptos.map(crypto => (
            <div key={crypto.id} className="ticker">
              <strong>{crypto.name}:</strong> ${crypto.priceUsd}
            </div>
          ))}
        </div>
      </div>
      <div className="portfolio-value" onClick={onOpenPortfolio}>
        {totalPortfolioValue.toFixed(2)} USD {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)} ({portfolioChangePercentage}%)
      </div>
    </div>
  );
};

export default Header;
