// Header.tsx
import React, { useEffect, useState } from 'react';
import { httpGet } from '../api/apiHandler';
import { CurrencyEntity } from '../interfaces';
import PortfolioModal from '../modul/modulPage'; // Импортируем компонент модального окна с портфолио
import './Header.css'; // Подключение CSS файла

const Header: React.FC = () => {
  const [cryptoRates, setCryptoRates] = useState<CurrencyEntity[]>([]);
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<CurrencyEntity[]>([]); // Состояние портфолио

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


  return (
    <div className="header">
      <div className="crypto-rates">
        {cryptoRates.map(crypto => (
          <div key={crypto.id} className="ticker">
            <strong>{crypto.name}:</strong> ${crypto.priceUsd}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;