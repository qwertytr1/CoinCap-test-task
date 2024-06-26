import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { CurrencyEntity } from '../interfaces';
import { getStorageItem, setStorageItem } from '../utils/utils';
import { httpGet } from '../api/apiHandler';

interface PortfolioContextType {
  coins: CurrencyEntity[];
  loading: boolean;
  selectedCoin: CurrencyEntity | null;
  searchValue: string;
  addCoinsModalVisible: boolean;
  coinForAdd: CurrencyEntity | null;
  portfolio: CurrencyEntity[];
  portfolioVisible: boolean;
  searchLoading: boolean;
  portfolioCostDifference: number;
  handleSearch: (value: string) => void;
  handleSelectCoin: (coinId: string) => void;
  handleCloseCoinInfo: () => void;
  handleOpenAddCoinsModal: (coin: CurrencyEntity) => void;
  handleCloseAddCoinsModal: () => void;
  handleOpenPortfolio: () => void;
  handleClosePortfolio: () => void;
  handleAddToPortfolio: (coin: CurrencyEntity[]) => void;
  handleDeleteCoin: (id: string) => void;
  fetchCryptoRates: () => Promise<void>;
  filteredCoins: CurrencyEntity[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CurrencyEntity | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);
  const [coinForAdd, setCoinForAdd] = useState<CurrencyEntity | null>(null);
  const [searchLoading] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<CurrencyEntity[]>(() => {
    const savedPortfolio = getStorageItem('portfolio');
    return savedPortfolio ? savedPortfolio : [];
  });
  const [portfolioCostDifference, setPortfolioCostDifference] = useState<number>(0);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await httpGet(`/assets`);
      const responseData = response.data as { data: CurrencyEntity[] };
      setCoins(responseData.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setLoading(false);
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSelectCoin = useCallback((coinId: string) => {
    const selected = coins.find((coin: CurrencyEntity) => coin.id === coinId);
    setSelectedCoin(selected || null);
  }, [coins]);
  const handleCloseCoinInfo = () => {
    setSelectedCoin(null);
  };


  const handleOpenAddCoinsModal = (coin: CurrencyEntity) => {
    setCoinForAdd(coin);
    setAddCoinsModalVisible(true);
  };

  const handleCloseAddCoinsModal = () => {
    setAddCoinsModalVisible(false);
    setCoinForAdd(null);
  };

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
    }, 2000);

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

  const handleAddToPortfolio = (coins: CurrencyEntity[]) => {
    coins.forEach(coin => {
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
    });
  };


  const handleDeleteCoin = (id: string) => {
    const updatedPortfolio = portfolio.filter(coin => coin.id !== id);
    setPortfolio(updatedPortfolio);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const contextValue: PortfolioContextType = {
    coins,
    loading,
    selectedCoin,
    searchValue,
    addCoinsModalVisible,
    coinForAdd,
    portfolio,
    portfolioVisible,
    portfolioCostDifference,
    searchLoading,
    handleSearch,
    handleSelectCoin,
    handleCloseCoinInfo,
    handleOpenAddCoinsModal,
    handleCloseAddCoinsModal,
    handleOpenPortfolio,
    handleClosePortfolio,
    handleAddToPortfolio,
    handleDeleteCoin,
    fetchCryptoRates,
    filteredCoins,
  };

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export default PortfolioContext;
