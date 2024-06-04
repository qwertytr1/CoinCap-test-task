import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { httpGet } from './api/apiHandler';
import CoinSearch from './CoinTableElement/coinSearch';
import CoinTableContent from './CoinTableElement/coinTableContent';
import CoinPage from './CoinPages/CoinPage';
import PortfolioModal from './modul/modulPage'; // Import PortfolioModal component
import { useParams } from 'react-router-dom';
import { CurrencyEntity } from './interfaces';

interface CoinTableProps {
  portfolio: CurrencyEntity[];
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  onDeleteCoin: (id: string) => void; // Add this line
}

const CoinTable: React.FC<CoinTableProps> = ({ portfolio, onAddToPortfolio, onDeleteCoin }) => {
  const { coinId } = useParams();
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CurrencyEntity | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await httpGet('/assets');
      const responseData = response.data as { data: CurrencyEntity[] };
      setCoins(responseData.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setLoading(false);
    }
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

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleOpenPortfolio = () => {
    setPortfolioVisible(true);
  };

  const handleClosePortfolio = () => {
    setPortfolioVisible(false);
  };

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <CoinSearch searchValue={searchValue} handleSearch={handleSearch} />
      {loading ? (
        <Spin />
      ) : selectedCoin ? (
        <CoinPage coin={selectedCoin} onClose={handleCloseCoinInfo} onAddToPortfolio={onAddToPortfolio} />
      ) : (
        <>
          <CoinTableContent
            coins={coins}
            onSelectCoin={handleSelectCoin}
            onAddToPortfolio={onAddToPortfolio} // Передаем функцию как есть
            onOpenAddCoinsModal={handleOpenPortfolio}
            onOpenPortfolio={handleOpenPortfolio}
          />
          <PortfolioModal
            visible={portfolioVisible}
            onClose={handleClosePortfolio}
            portfolio={portfolio}
            onDelete={onDeleteCoin} // Передаем функцию удаления
          />
        </>
      )}
    </div>
  );
};

export default CoinTable;
