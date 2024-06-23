import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './app/Header/Header';
import PortfolioModal from './app/Moduls/PortfolioModal';
import routes from './app/routes/routes';
import { CurrencyEntity } from './app/interfaces';
import { getStorageItem, setStorageItem } from './app/utils/utils';
import { RouteProvider } from './app/routes/RouteContext';
import { httpGet } from './app/api/apiHandler';
import ErrorPage from './app/ErrorPage/ErrorPage';

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

      const updatedPortfolio = portfolio.map(coin => {
        const updatedCoin = coinsData.find(apiCoin => apiCoin.id === coin.id);
        if (updatedCoin) {
          return { ...coin, priceUsd: updatedCoin.priceUsd };
        }
        return coin;
      });
      setPortfolio(updatedPortfolio);
    } catch (error) {
      toast.error(`Ошибка при получении списка криптовалют: ${error}`);
    }
  }, [portfolio]);

  useEffect(() => {
    const storedPortfolio = getStorageItem('portfolio');
    if (storedPortfolio) {
      setPortfolio(storedPortfolio);
    }
  }, []);

  useEffect(() => {
    setStorageItem('portfolio', portfolio);
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

  return (
    <>
      <ToastContainer />
      <Router>
        <RouteProvider routes={routes}>
          <div className="App">
            <Header portfolio={portfolio} onOpenPortfolio={handleOpenPortfolio} totalPortfolioValue={PartfolioCostDifference} />
            <PortfolioModal
              visible={portfolioVisible}
              onClose={handleClosePortfolio}
              portfolio={portfolio}
              onDelete={handleDeleteCoin}
              totalPortfolioValue={PartfolioCostDifference}
            />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {routes.map((route, index) => (
   <Route key={index} path={route.path} element={<route.component
    portfolio={portfolio}
    onAddToPortfolio={handleAddToPortfolio}
    onDeleteCoin={handleDeleteCoin}
                totalPortfolioValue={PartfolioCostDifference}
  />} />
                ))}
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </div>
        </RouteProvider>
      </Router>
    </>
  );
};

export default App;
