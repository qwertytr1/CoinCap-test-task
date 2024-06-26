import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { usePortfolio } from 'app/context/PortfolioContext';

const { Search } = Input;

const CoinSearch: React.FC = () => {

  const { handleSearch } = usePortfolio();
  const [inputValue, setInputValue] = useState<string>('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    if (value.trim() !== '' || value === '') {
      handleSearchWithDelay(value);
    }
  };

  const handleSearchWithDelay = (value: string) => {
    if (value === '') {
      handleSearch('');
      return;
    }

    setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  return (
    <Search
      placeholder="Search coin"
      value={inputValue}
      onChange={handleInputChange}
      enterButton={<SearchOutlined />}
      style={{ marginBottom: 16 }}
    />
  );
};

export default CoinSearch;