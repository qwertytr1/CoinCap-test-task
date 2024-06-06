// App.tsx
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { httpGet } from './app/api/apiHandler';
import Header from './app/header/header';
import PortfolioModal from './app/modul/modulPage';
import CoinTable from './app/coinTable';

import { CurrencyEntity } from './app/interfaces';
import AddCoinsModal from './app/modul/addCoins';

const App: React.FC = () => {
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<CurrencyEntity[]>([]);
  const [cryptoRates, setCryptoRates] = useState<CurrencyEntity[]>([]);
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);
  const [selectedCoinsToAdd, setSelectedCoinsToAdd] = useState<CurrencyEntity[]>([]);

  useEffect(() => {
    fetchCryptoRates();
  }, []);

  const fetchCryptoRates = async () => {
    try {
      const response = await httpGet<{ data: CurrencyEntity[] }>('/assets');
      setCryptoRates(response.data.data);
    } catch (error) {
      console.error('Ошибка при получении списка криптовалют:', error);
    }
  };
  const handleCloseAddCoinsModal = () => {
    setAddCoinsModalVisible(false);
};
  const handleOpenPortfolio = () => {
    setPortfolioVisible(true);
  };

  const handleClosePortfolio = () => {
    setPortfolioVisible(false);
  };

  const handleOpenAddCoinsModal = () => {
    const selectedCoins = cryptoRates.filter(coin => !portfolio.some(portfolioCoin => portfolioCoin.id === coin.id));
    setSelectedCoinsToAdd(selectedCoins);
    setAddCoinsModalVisible(true);
  };

  const handleAddCoins = async (selectedCoins: CurrencyEntity[], coinQuantities: { [key: string]: number }) => {
    // Создаем копию текущего портфеля
    const updatedPortfolio = [...portfolio];

    // Проходимся по выбранным монетам
    selectedCoins.forEach(coin => {
      // Проверяем, существует ли монета уже в портфеле
      const existingCoinIndex = updatedPortfolio.findIndex(portfolioCoin => portfolioCoin.id === coin.id);

      // Если монета уже есть, добавляем к существующему количеству
      if (existingCoinIndex !== -1) {
        updatedPortfolio[existingCoinIndex].quantity += coinQuantities[coin.id] || 0;
      } else {
        // Если монета новая, добавляем ее в портфель с указанным количеством
        updatedPortfolio.push({
          ...coin,
          quantity: coinQuantities[coin.id] || 0
        });
      }
    });

    setPortfolio(updatedPortfolio);

    const totalPortfolioValue = updatedPortfolio.reduce((acc, coin) => acc + (parseFloat(coin.priceUsd) * (coin.quantity || 0)), 0);
    console.log('Общая стоимость портфеля:', totalPortfolioValue);

    setAddCoinsModalVisible(false);
    setPortfolioVisible(true);
  };

  const handleDeleteCoin = (id: string) => {
    const updatedPortfolio = portfolio.filter(coin => coin.id !== id);
    setPortfolio(updatedPortfolio);
  };

  const handleAddToPortfolio = (coin: CurrencyEntity) => {
    if (!portfolio.some(portfolioCoin => portfolioCoin.id === coin.id)) {
      const updatedPortfolio = [...portfolio, coin];
      setPortfolio(updatedPortfolio);
    }
  };

  return (
    <div className="App">
      <Header portfolio={portfolio} onOpenPortfolio={handleOpenPortfolio} />
      <PortfolioModal
        visible={portfolioVisible}
        onClose={handleClosePortfolio}
        portfolio={portfolio}
        onDelete={handleDeleteCoin}
      />
      <CoinTable
        portfolio={portfolio}
        onAddToPortfolio={handleAddToPortfolio}
        onDeleteCoin={handleDeleteCoin}
       />
      <AddCoinsModal
        open={addCoinsModalVisible}
        onClose={handleCloseAddCoinsModal}
        coins={selectedCoinsToAdd}
        onAddCoins={handleAddCoins}
      />
    </div>
  );
};

export default App;
