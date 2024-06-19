
import React, { useState, useEffect, useCallback } from 'react';
import { Spin } from 'antd';
import { httpGet } from './api/apiHandler';
import CoinSearch from './CoinTableElement/CoinSearch';
import CoinTableContent from './CoinTableElement/CoinTableContent';
import CoinPage from './CoinPages/CoinPage';
import PortfolioModal from './Moduls/PortfolioModal';
import AddCoinsModal from './Moduls/AddCoinsModal';
import { CurrencyEntity, CoinTableProps } from './interfaces';
import styles from './CoinTable.module.scss';
import { useParams, useNavigate, useLocation } from 'react-router-dom';



const CoinTable: React.FC<CoinTableProps> = ({ portfolio, onAddToPortfolio, onDeleteCoin, totalPortfolioValue }) => {
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CurrencyEntity | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading ] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);
  const [coinForAdd, setCoinForAdd] = useState<CurrencyEntity | null>(null);
  const { rank } = useParams<{ rank: string }>();
  const navigate = useNavigate();
  const location = useLocation();


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

  };

  const handleCloseAddCoinsModal = () => {
    setAddCoinsModalVisible(false);
    setCoinForAdd(null);
  };

  const handleAddToPortfolio = (coins: CurrencyEntity[]) => {
    coins.forEach(onAddToPortfolio);
    setCoinForAdd(null);
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
          {!selectedCoin && (
            <CoinSearch
              searchValue={searchValue}
              handleSearch={handleSearch}
            />
          )}
            {searchLoading && <div>Searching...</div>}

          {selectedCoin ? (
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
