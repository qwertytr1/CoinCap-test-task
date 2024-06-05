import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { httpGet } from './api/apiHandler';
import CoinSearch from './CoinTableElement/coinSearch';
import CoinTableContent from './CoinTableElement/coinTableContent';
import CoinPage from './CoinPages/CoinPage';
import PortfolioModal from './modul/modulPage';
import AddCoinsModal from './modul/addCoins';
import { useParams } from 'react-router-dom';
import { CurrencyEntity } from './interfaces';

interface CoinTableProps {
  portfolio: CurrencyEntity[];
  onAddToPortfolio: (coins: CurrencyEntity[], quantity: number) => void;
  onDeleteCoin: (id: string) => void;
  onOpenAddCoinsModal: () => void;
  onOpenPortfolio: () => void;
}

const CoinTable: React.FC<CoinTableProps> = ({ portfolio, onAddToPortfolio, onDeleteCoin, onOpenAddCoinsModal, onOpenPortfolio }) => {
  const { coinId } = useParams();
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CurrencyEntity | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);

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
            onAddToPortfolio={onAddToPortfolio}
            onOpenAddCoinsModal={() => setAddCoinsModalVisible(true)}
          />
          <AddCoinsModal // Add coins modal
            open={addCoinsModalVisible}
            onClose={() => setAddCoinsModalVisible(false)}
            coins={coins}
            onAddCoins={onAddToPortfolio}
          />
        </>
      )}
    </div>
  );
};

export default CoinTable;
