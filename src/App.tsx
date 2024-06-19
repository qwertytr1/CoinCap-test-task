import React, { useState, useEffect, useCallback } from 'react';
import { httpGet } from './app/api/apiHandler';
import Header from './app/Header/Header';
import PortfolioModal from './app/Moduls/PortfolioModal';
import CoinTable from './app/CoinTable';
import { CurrencyEntity } from './app/interfaces';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorPage from './app/ErrorPage/ErrorPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//use contexts

const App: React.FC = () => {
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<CurrencyEntity[]>(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  });
  const [PartfolioCostDifference, setPortfolioCostDifference] = useState<number>(0);
  const fetchCryptoRates = useCallback(async () => {
    try {
      const { data: { data: coinsData } } = await httpGet<{ data: CurrencyEntity[] }>('/assets');

      const updatedPortfolio = portfolio.reduce((acc: CurrencyEntity[], coin: CurrencyEntity) => {
        const updatedCoin = coinsData.find(apiCoin => apiCoin.id === coin.id);
        acc.push(updatedCoin ? { ...coin, priceUsd: updatedCoin.priceUsd } : coin);
        return acc;
      }, []);

      setPortfolio(updatedPortfolio);
    } catch (error) {
     toast.error(`Ошибка при получении списка криптовалют:${error}`);
    }
  }, [portfolio]);

//create func getStorageItem arg string
  //set storage items вынести в utils
  //c
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    setPortfolioCostDifference(calculateDifference(portfolio));
  }, [portfolio]);
  useEffect(() => {
    if (portfolioVisible && !portfolio.length) {
      fetchCryptoRates();
    }
  }, [fetchCryptoRates, portfolio, portfolioVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchCryptoRates]);

  const calculateDifference = (portfolio: CurrencyEntity[]) => {
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
      toast.error('Количество монет должно быть в диапазоне от 0.01 до 1000');
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

  const handleDeleteCoin = (id: string) => {
    const updatedPortfolio = portfolio.filter(coin => coin.id !== id);
    setPortfolio(updatedPortfolio);
  };
//recheck routes dont use одинаковые элементы в рутах  вынести руты в отдельный компонент кщгеуы  Настройка маршрутизации для реакт приложения laxyloading
  return (
    <>
    <ToastContainer />
    <Router>
      <div className="App">

        <Header portfolio={portfolio} onOpenPortfolio={handleOpenPortfolio} totalPortfolioValue={PartfolioCostDifference} />
        <PortfolioModal
          visible={portfolioVisible}
          onClose={handleClosePortfolio}
          portfolio={portfolio}
          onDelete={handleDeleteCoin}
          totalPortfolioValue={PartfolioCostDifference}
        />
 <Routes>
        <Route
          path="/"
          element={
            <CoinTable
              portfolio={portfolio}
              onAddToPortfolio={handleAddToPortfolio}
              onDeleteCoin={handleDeleteCoin}
              totalPortfolioValue={PartfolioCostDifference}
            />
          }
        />
        <Route
          path="/coin/:rank"
          element={
            <CoinTable
              portfolio={portfolio}
              onAddToPortfolio={handleAddToPortfolio}
              onDeleteCoin={handleDeleteCoin}
              totalPortfolioValue={PartfolioCostDifference}
            />
          }
        />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
      </div>
    </Router></>
  );
};

export default App;