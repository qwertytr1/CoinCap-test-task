import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { httpGet } from './api/apiHandler';
import CoinSearch from './CoinTableElement/coinSearch';
import CoinTableContent from './CoinTableElement/coinTableContent';
import CoinPage from './CoinPages/CoinPage';
import { useParams } from 'react-router-dom';
import { CurrencyEntity } from './interfaces';

const CoinTable = () => {
  const { coinId } = useParams();
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CurrencyEntity | null>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await httpGet('/assets');
      const responseData = response.data as { data: CurrencyEntity[] }; // Приведение типа
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
        <CoinPage coin={selectedCoin} onClose={handleCloseCoinInfo} />
      ) : (
<CoinTableContent
  coins={coins}
  onSelectCoin={handleSelectCoin}
/>
      )}
    </div>
  );
};

export default CoinTable;
