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
  const [portfolio, setPortfolio] = useState<CurrencyEntity[]>(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  });
  const [cryptoRates, setCryptoRates] = useState<CurrencyEntity[]>([]);
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);
  const [selectedCoinsToAdd, setSelectedCoinsToAdd] = useState<CurrencyEntity[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);

  useEffect(() => {
    fetchCryptoRates();
    setTotalPortfolioValue(calculatePortfolioValue(portfolio));
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    setTotalPortfolioValue(calculatePortfolioValue(portfolio));
  }, [portfolio]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchCryptoRates = async () => {
    try {
      const response = await httpGet<{ data: CurrencyEntity[] }>('/assets');
      setCryptoRates(response.data.data);

      const updatedPortfolio = portfolio.map(coin => {
        const updatedCoin = response.data.data.find(apiCoin => apiCoin.id === coin.id);
        return updatedCoin ? { ...coin, priceUsd: updatedCoin.priceUsd } : coin;
      });

      setPortfolio(updatedPortfolio);
    } catch (error) {
      console.error('Ошибка при получении списка криптовалют:', error);
    }
  };

  const calculatePortfolioValue = (portfolio: CurrencyEntity[]) => {
    return portfolio.reduce((acc, coin) => acc + (parseFloat(coin.priceUsd) * (coin.quantity || 0)), 0);
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

  const handleAddToPortfolio = (coin: CurrencyEntity) => {
    const updatedPortfolio = [...portfolio];
    const existingCoinIndex = updatedPortfolio.findIndex(portfolioCoin => portfolioCoin.id === coin.id);

    if (existingCoinIndex !== -1) {

      if (coin.quantity < 0.01 || coin.quantity > 1000) {
        alert('Количество монет должно быть в диапазоне от 0.01 до 1000');
        return;
      }
      updatedPortfolio[existingCoinIndex].quantity += coin.quantity;
    } else {

      if (coin.quantity < 0.01 || coin.quantity > 1000) {
        alert('Количество монет должно быть в диапазоне от 0.01 до 1000');
        return;
      }
      updatedPortfolio.push({ ...coin, purchasePrice: parseFloat(coin.priceUsd) });
    }

    setPortfolio(updatedPortfolio);
  };

  const handleCloseAddCoinsModal = () => {
    setAddCoinsModalVisible(false);
  };

  const handleAddCoins = (coinsToAdd: CurrencyEntity[]) => {
    const updatedPortfolio = [...portfolio];
    coinsToAdd.forEach(coin => {
      const existingCoinIndex = updatedPortfolio.findIndex(portfolioCoin => portfolioCoin.id === coin.id);
      if (existingCoinIndex !== -1) {
        updatedPortfolio[existingCoinIndex].quantity += coin.quantity;
      } else {
        updatedPortfolio.push({ ...coin, purchasePrice: parseFloat(coin.priceUsd) });
      }
    });

    setPortfolio(updatedPortfolio);
    setAddCoinsModalVisible(false);
    setPortfolioVisible(true);
  };

  const handleDeleteCoin = (id: string) => {
    const updatedPortfolio = portfolio.filter(coin => coin.id !== id);
    setPortfolio(updatedPortfolio);
  };

  return (
    <div className="App">
      <Header portfolio={portfolio} onOpenPortfolio={handleOpenPortfolio} totalPortfolioValue={totalPortfolioValue} />
      <PortfolioModal
        visible={portfolioVisible}
        onClose={handleClosePortfolio}
        portfolio={portfolio}
        onDelete={handleDeleteCoin}
        totalPortfolioValue={totalPortfolioValue}
      />
      <CoinTable
        portfolio={portfolio}
        onAddToPortfolio={handleAddToPortfolio}
        onDeleteCoin={handleDeleteCoin}
        totalPortfolioValue={totalPortfolioValue}
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
