// CoinSearch.tsx
import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  onSearch: (value: string) => void;
}

const CoinSearch: React.FC<Props> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch(searchValue);
  };

  return (
    <Input
      placeholder="Search coin"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onPressEnter={handleSearch}
      suffix={<SearchOutlined onClick={handleSearch} />}
      style={{ marginBottom: 16 }}
    />
  );
};

export default CoinSearch;
