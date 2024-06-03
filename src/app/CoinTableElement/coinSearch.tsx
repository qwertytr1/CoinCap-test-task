import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

interface CoinSearchProps {
  searchValue: string;
  handleSearch: (value: string) => void;
}

const CoinSearch: React.FC<CoinSearchProps> = ({ searchValue, handleSearch }) => {
  return (
    <Search
      placeholder="Search coin"
      value={searchValue}
      onChange={(e) => handleSearch(e.target.value)}
      enterButton={<SearchOutlined />}
      style={{ marginBottom: 16 }}
    />
  );
};

export default CoinSearch;