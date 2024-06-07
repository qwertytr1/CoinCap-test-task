import React, { useState, useEffect, useCallback } from 'react';
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
  const [, setCryptoRates] = useState<CurrencyEntity[]>([]);
  const [selectedCoinsToAdd] = useState<CurrencyEntity[]>([]);
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);

  const fetchCryptoRates = useCallback(async () => {
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
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    setTotalPortfolioValue(calculatePortfolioValue(portfolio));
  }, [portfolio]);

  useEffect(() => {
    if (portfolioVisible && !portfolio.length) {
      fetchCryptoRates();
    }
  }, [fetchCryptoRates, portfolio, portfolioVisible]);
  useEffect(() => {
    setTotalPortfolioValue(calculatePortfolioValue(portfolio));
  }, [portfolio]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchCryptoRates]);

  const calculatePortfolioValue = (portfolio: CurrencyEntity[]) => {
    return portfolio.reduce((acc, coin) => acc + (parseFloat(coin.priceUsd) * (coin.quantity || 0)), 0);
  };

  const handleOpenPortfolio = () => {
    setPortfolioVisible(true);
  };

  const handleClosePortfolio = () => {
    setPortfolioVisible(false);
  };

  const handleAddToPortfolio = (coin: CurrencyEntity) => {
    if (coin.quantity < 0.01 || coin.quantity > 1000) {
      alert('Количество монет должно быть в диапазоне от 0.01 до 1000');
      return;
    }

    const existingCoin = portfolio.find(portfolioCoin => portfolioCoin.id === coin.id);

    if (existingCoin) {
      const updatedPortfolio = portfolio.map(portfolioCoin => {
        if (portfolioCoin.id === coin.id) {
          return {
            ...portfolioCoin,
            quantity: portfolioCoin.quantity + coin.quantity,
          };
        }
        return portfolioCoin;
      });

      setPortfolio(updatedPortfolio);
    } else {
      setPortfolio(prevPortfolio => [...prevPortfolio, { ...coin, purchasePrice: parseFloat(coin.priceUsd) }]);
    }
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
