
import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './CoinSearch.module.scss';
import { CoinSearchProps } from '../../interfaces';

const { Search } = Input;

const CoinSearch: React.FC<CoinSearchProps> = ({ handleSearch }) => {
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
