import React, { useState, useEffect, useCallback } from 'react';
import { Spin } from 'antd';
import { httpGet } from './api/apiHandler';
import CoinSearch from './CoinTableElement/coinSearch';
import CoinTableContent from './CoinTableElement/coinTableContent';
import CoinPage from './CoinPages/CoinPage';
import PortfolioModal from './modul/modulPage';
import AddCoinsModal from './modul/addCoins';
import { CurrencyEntity } from './interfaces';
import styles from './CoinTable.module.scss';
import { debounce } from './CoinTableElement/utils';

interface CoinTableProps {
  portfolio: CurrencyEntity[];
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  onDeleteCoin: (id: string) => void;
  totalPortfolioValue: number;
}

const CoinTable: React.FC<CoinTableProps> = ({ portfolio, onAddToPortfolio, onDeleteCoin, totalPortfolioValue }) => {
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CurrencyEntity | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);
  const [coinForAdd, setCoinForAdd] = useState<CurrencyEntity | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [totalCoins, setTotalCoins] = useState<number>(0);

  useEffect(() => {
    fetchCoins(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchCoins = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await httpGet(`/assets?page=${page}&limit=${limit}`);
      const responseData = response.data as { data: CurrencyEntity[], total: number };
      setCoins(responseData.data);
      setTotalCoins(responseData.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setLoading(false);
    }
  };

  const debouncedFetchCoins = useCallback(
    debounce((value: string) => {
      setSearchLoading(true);
      setTimeout(async () => {
        await fetchCoins(currentPage, pageSize);
        setSearchLoading(false);
      }, 500);  // Added timeout to simulate search loading
    }, 500),
    [currentPage, pageSize]
  );

  useEffect(() => {
    debouncedFetchCoins(searchValue);
  }, [searchValue, debouncedFetchCoins]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSelectCoin = (coinId: string) => {
    const selected = coins.find((coin: CurrencyEntity) => coin.id === coinId);
    if (selected) {
      setSelectedCoin(selected);
    }
  };

  const handleCloseCoinInfo = () => {
    setSelectedCoin(null);
  };

  const handleOpenPortfolio = () => {
    setPortfolioVisible(true);
  };

  const handleClosePortfolio = () => {
    setPortfolioVisible(false);
  };

  const handleOpenAddCoinsModal = (coin: CurrencyEntity) => {
    setCoinForAdd(coin);
    setAddCoinsModalVisible(true);
  };

  const handleCloseAddCoinsModal = () => {
    setAddCoinsModalVisible(false);
    setCoinForAdd(null);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
    if (pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
  };

  const handleAddToPortfolio = (coins: CurrencyEntity[]) => {
    coins.forEach(onAddToPortfolio);
    setAddCoinsModalVisible(false);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={styles.mainContainer}>
      {!selectedCoin && <CoinSearch searchValue={searchValue} handleSearch={handleSearch} />}
      {searchLoading && <div>Searching...</div>}
      {loading ? (
        <Spin />
      ) : selectedCoin ? (
        <CoinPage coin={selectedCoin} onClose={handleCloseCoinInfo} onAddToPortfolio={onAddToPortfolio} />
      ) : (
        <>
          <CoinTableContent
            coins={filteredCoins}
            onSelectCoin={handleSelectCoin}
            onAddToPortfolio={onAddToPortfolio}
            onOpenAddCoinsModal={handleOpenAddCoinsModal}
            onOpenPortfolio={handleOpenPortfolio}
            onTableChange={handleTableChange}
            total={totalCoins}
            pageSize={pageSize}
            currentPage={currentPage}
          />
          <PortfolioModal
            totalPortfolioValue={totalPortfolioValue}
            visible={portfolioVisible}
            onClose={handleClosePortfolio}
            portfolio={portfolio}
            onDelete={onDeleteCoin}
          />
          {coinForAdd && (
            <AddCoinsModal
              open={addCoinsModalVisible}
              onClose={handleCloseAddCoinsModal}
              coins={[coinForAdd]}
              onAddCoins={handleAddToPortfolio}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CoinTable;
