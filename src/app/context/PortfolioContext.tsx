import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { toast } from 'react-toastify';
import { CurrencyEntity } from '../interfaces';
import { getStorageItem, setStorageItem } from '../utils/utils';
import { httpGet } from '../api/apiHandler';

interface PortfolioContextType {
  coins: CurrencyEntity[];
  currentCoins: CurrencyEntity[];
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
  fetchCoins: () => void;
  handleAddToPortfolio: (coins: CurrencyEntity[]) => void;
  handleDeleteCoin: (id: string) => void;
  handleTableChange: (pagination: any) => void;
  handlePageSizeChange: (pageSize: number) => void;
  filteredCoins: CurrencyEntity[];
  pagination: {
    current: number;
    pageSize: number;

  };
  totalElement: number;
  isCoinPage: boolean;
  setIsCoinPage: (value: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [currentCoins, setCurrentCoins] = useState<CurrencyEntity[]>([]);
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [totalElement,setTotalElement] = useState<number>(0)
  const [isCoinPage, setIsCoinPage] = useState<boolean>(false);
  const fetchCurrentCoins = async () => {
    setLoading(true);
    try {
      const offset = (pagination.current - 1) * pagination.pageSize;
      const response = await httpGet(`/assets?limit=${pagination.pageSize}&offset=${offset}`);
      const responseData = response.data as { data: CurrencyEntity[], total: number };
      setCurrentCoins(responseData.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(`Ошибка при получении списка криптовалют: ${error}`);
    }
  };

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await httpGet(`/assets`);
      const responseData = response.data as { data: CurrencyEntity[] };
      setCoins(responseData.data);
      setTotalElement(responseData.data.length);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(`Ошибка при получении списка криптовалют: ${error}`);
    }
  };

  useEffect(() => {
    if (isCoinPage==true) {
      fetchCoins();
    }
    else {
      if(pagination.current, pagination.pageSize,isCoinPage == false){
          fetchCoins();
    fetchCurrentCoins();}
    }

},[isCoinPage,pagination.current, pagination.pageSize])
  useEffect(() => {
    if (isCoinPage) {
      const interval = setInterval(() => {
        fetchCoins();
      }, 10000);

      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        fetchCoins();
        fetchCurrentCoins();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [pagination.current, pagination.pageSize, isCoinPage]);

//   useEffect(() => {
//     fetchCoins();
//     fetchCurrentCoins();
// }, [pagination.current, pagination.pageSize]);
  const updatePortfolio = useCallback((coinsData: CurrencyEntity[], currentPortfolio: CurrencyEntity[]) => {
    const updatedPortfolio = currentPortfolio.map(coin => {
      const updatedCoin = coinsData.find(apiCoin => apiCoin.id === coin.id);
      return updatedCoin ? { ...coin, priceUsd: updatedCoin.priceUsd } : coin;
    });

    if (JSON.stringify(updatedPortfolio) !== JSON.stringify(currentPortfolio)) {
      setPortfolio(updatedPortfolio);
    }
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSelectCoin = useCallback((coinId: string) => {
    const selected = currentCoins.find((coin: CurrencyEntity) => coin.id === coinId);
    setSelectedCoin(selected || null);
  }, [currentCoins]);

  const handleCloseCoinInfo = useCallback(() => {
    setSelectedCoin(null);
  }, []);

  const handleOpenAddCoinsModal = useCallback((coin: CurrencyEntity) => {
    setCoinForAdd(coin);
    setAddCoinsModalVisible(true);
  }, []);

  const handleCloseAddCoinsModal = useCallback(() => {
    setAddCoinsModalVisible(false);
    setCoinForAdd(null);
  }, []);

  useEffect(() => {
    const storedPortfolio = getStorageItem('portfolio');
    if (storedPortfolio) {
      setPortfolio(storedPortfolio);
    }
  }, []);

  useEffect(() => {
    setStorageItem('portfolio', portfolio);
    setPortfolioCostDifference(calculateDifference(portfolio));
    updatePortfolio(coins, portfolio);
  }, [portfolio, coins, updatePortfolio]);



  const calculateDifference = (portfolio: CurrencyEntity[]) => {
    return portfolio.reduce((acc, coin) => acc + (parseFloat(coin.priceUsd) * (coin.quantity || 0)), 0);
  };

  const handleOpenPortfolio = useCallback(() => {
    setPortfolioVisible(true);
  }, []);

  const handleAddToPortfolio = useCallback((coins: CurrencyEntity[]) => {
    setPortfolio(prevPortfolio => {
      const newPortfolio = [...prevPortfolio];

      coins.forEach(coin => {
        if (coin.quantity < 0.01 || coin.quantity > 1000) {
          toast.error('Количество монет должно быть в диапазоне от 0.01 до 1000');
          return;
        }

        const existingCoin = newPortfolio.find(portfolioCoin => portfolioCoin.id === coin.id);

        if (existingCoin) {
          existingCoin.quantity += coin.quantity;
        } else {
          newPortfolio.push({ ...coin, purchasePrice: parseFloat(coin.priceUsd) });
        }
      });

      return newPortfolio;
    });
  }, []);

  const handleClosePortfolio = useCallback(() => {
    setPortfolioVisible(false);
  }, []);

  const handleDeleteCoin = useCallback((id: string) => {
    setPortfolio(prevPortfolio => prevPortfolio.filter(coin => coin.id !== id));
  }, []);

  const handleTableChange = useCallback((pagination: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      pageSize,
    }));
  }, []);

  const filteredCoins = useMemo(() => currentCoins.filter(coin =>
    coin.name.toLowerCase().includes(searchValue.toLowerCase())
  ), [currentCoins, searchValue]);

  const contextValue = useMemo(() => ({
    coins,
    currentCoins,
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
    handleTableChange,
    filteredCoins,
    fetchCoins,
    pagination,
    handlePageSizeChange,
    totalElement,
    isCoinPage,
    setIsCoinPage,
  }), [
    coins,
    currentCoins,
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
    handleTableChange,
    filteredCoins,
    fetchCoins,
    pagination,
    handlePageSizeChange,
    totalElement,
    isCoinPage,
    setIsCoinPage,
  ]);

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
