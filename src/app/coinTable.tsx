import React, { useState, useEffect } from 'react';
import { Table, Input, Spin, Typography, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { httpGet } from './api/apiHandler';
import { CurrencyEntity } from './interfaces';

const { Column } = Table;
const { Search } = Input;
const { Text } = Typography;

const CoinTable = () => {
  const [coins, setCoins] = useState<CurrencyEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await httpGet<{ data: CurrencyEntity[] }>('/assets');
      const data: CurrencyEntity[] = response.data.data;
      setCoins(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    setLoading(true);
    try {
      const response = await httpGet<{ data: CurrencyEntity[] }>(`/assets?search=${value}`);
      const data: CurrencyEntity[] = response.data.data;
      setCoins(data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching coins:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <Search
        placeholder="Search coin"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        enterButton={<SearchOutlined />}
        style={{ marginBottom: 16 }}
      />
      {loading ? (
        <Spin />
      ) : (
        <Table dataSource={coins} rowKey="id" pagination={{ defaultPageSize: 50 }}>
<Column
  title="Название монеты"
  key="name"
  render={(record: CurrencyEntity) => (
    <div>
      <Text strong>{record.name}</Text>
      <Text type="secondary" style={{ marginLeft: 5 }}>
        {record.symbol}
      </Text>
    </div>
  )}
/>
          <Column
            title="Логотип монеты"
            dataIndex="symbol"
            key="logo"
            render={symbol => (
              <img src={`https://static.coincap.io/assets/icons/${symbol.toLowerCase()}.png`} alt="Логотип" />
            )}
          />
          <Column title="Цена в USD" dataIndex="priceUsd" key="priceUsd" />
          <Column
            title="Рыночная капитализация в USD"
            dataIndex="marketCapUsd"
            key="marketCapUsd"
          />
          <Column
            title="Изменение за 24 часа (%)"
            dataIndex="changePercent24Hr"
            key="changePercent24Hr"
          />
          <Column
            title="Добавить в портфель"
            key="add"
            render={() => <Button type="primary">Добавить</Button>}
          />
        </Table>
      )}
    </div>
  );
};

export default CoinTable;
