// В компоненте CoinTable

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
import { useParams, useNavigate, useLocation } from 'react-router-dom';

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
  const { rank } = useParams<{ rank: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [typing, setTyping] = useState(false);

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

  const handleTyping = useCallback(() => {
    if (!typing) {
      console.log('1');
      setTyping(true);
      setTimeout(() => setTyping(false), 500); // Сбрасываем значение typing после 0.5 секунд
    }
  }, [typing]);

  useEffect(() => {
    if (coins.length > 0) {
      const selected = coins.find((coin: CurrencyEntity) => coin.rank === rank);
      setSelectedCoin(selected || null);
      if (!selected && rank) {
        navigate('/error');
      }
    }
  }, [rank, coins, navigate]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

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

  const handleAddToPortfolio = (coins: CurrencyEntity[]) => {
    coins.forEach(onAddToPortfolio);
    setAddCoinsModalVisible(false);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <Spin />
      ) : (
        <>
          {!selectedCoin && location.pathname !== '/error' && (
            <CoinSearch
              searchValue={searchValue}
              handleSearch={handleSearch}
            />
          )}
          {searchLoading && <div>Searching...</div>}
          {selectedCoin && location.pathname !== '/error' ? (
            <CoinPage coin={selectedCoin} onClose={handleCloseCoinInfo} onAddToPortfolio={onAddToPortfolio} />
            ) : (
              <CoinTableContent
                coins={filteredCoins}
                onSelectCoin={handleSelectCoin}
                onAddToPortfolio={onAddToPortfolio}
                onOpenAddCoinsModal={handleOpenAddCoinsModal}
                onOpenPortfolio={handleOpenPortfolio}
              />
            )}
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
