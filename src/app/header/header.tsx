import React, { useEffect, useState } from 'react';
import { httpGet } from '../api/apiHandler';
import { CurrencyEntity } from '../interfaces';
import './Header.css';

interface HeaderProps {
  portfolio: CurrencyEntity[];
  onOpenPortfolio: () => void;
}

const Header: React.FC<HeaderProps> = ({ portfolio, onOpenPortfolio }) => {
  const [cryptoRates, setCryptoRates] = useState<CurrencyEntity[]>([]);
  const [initialPortfolioValue, setInitialPortfolioValue] = useState<number>(0);

  useEffect(() => {
    const fetchCryptoRates = async () => {
      try {
        const response = await httpGet<{ data: CurrencyEntity[] }>('/assets');
        const popularCryptos = ['bitcoin', 'ethereum', 'binance-coin'];
        const filteredRates = response.data.data.filter(crypto => popularCryptos.includes(crypto.id));
        setCryptoRates(filteredRates);
      } catch (error) {
        console.error('Ошибка при получении данных о криптовалютах:', error);
      }
    };

    fetchCryptoRates();
  }, []);

  useEffect(() => {
    const initialValue = portfolio.reduce((acc, coin) => acc + parseFloat(coin.priceUsd), 0);
    setInitialPortfolioValue(initialValue);
  }, [portfolio]);

  const currentPortfolioValue = portfolio.reduce((acc, coin) => acc + parseFloat(coin.priceUsd), 0);
  const portfolioChange = currentPortfolioValue - initialPortfolioValue;
  const portfolioChangePercentage = ((portfolioChange / initialPortfolioValue) * 100).toFixed(2);

  return (
    <div className="header">
      <div className="crypto-rates-container">
        <div className="crypto-rates">
          {cryptoRates.map(crypto => (
            <div key={crypto.id} className="ticker">
              <strong>{crypto.name}:</strong> ${crypto.priceUsd}
            </div>
          ))}
        </div>
      </div>
      <div className="portfolio-value" onClick={onOpenPortfolio}>
        {currentPortfolioValue.toFixed(2)} USD {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)} ({portfolioChangePercentage}%)
      </div>
    </div>
  );
};

export default Header;
