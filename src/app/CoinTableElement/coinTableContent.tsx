import React from 'react';
import { Table, Typography, Button } from 'antd';
import { CurrencyEntity } from '../interfaces';
import { TablePaginationConfig, SorterResult, TableCurrentDataSource, FilterValue } from 'antd/lib/table/interface';
import { formatValue } from './utils';

const { Column } = Table;
const { Text } = Typography;

interface CoinTableContentProps {
    coins: CurrencyEntity[];
    onSelectCoin: (coinId: string) => void;
    pagination?: { current: number; pageSize: number };
    handleTableChange?: (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<CurrencyEntity> | SorterResult<CurrencyEntity>[],
      extra: TableCurrentDataSource<CurrencyEntity>
    ) => void;
  }

const CoinTableContent: React.FC<CoinTableContentProps> = ({ coins, pagination, handleTableChange, onSelectCoin }) => {
  return (
    <Table
      dataSource={coins}
      rowKey="id"
      pagination={pagination}
      onChange={handleTableChange}
      onRow={(record) => ({
        onClick: () => onSelectCoin(record.id),
      })}
    >
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
          <img width={50} src={`https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`} alt="Логотип" />
        )}
      />
      <Column
        title="Цена в USD"
        dataIndex="priceUsd"
        key="priceUsd"
        render={(value: string) => `$${formatValue(value)}`}
        sorter
      />
      <Column
        title="Рыночная капитализация в USD"
        dataIndex="marketCapUsd"
        key="marketCapUsd"
        render={(value: string) => `$${formatValue(value)}`}
        sorter
      />
      <Column
        title="Изменение за 24 часа (%)"
        dataIndex="changePercent24Hr"
        key="changePercent24Hr"
        render={(value: string) => `${Number(value).toFixed(2)}%`}
        sorter
      />
      <Column
        title="Добавить в портфель"
        key="add"
        render={() => <Button type="primary">Добавить</Button>}
      />
    </Table>
  );
};

export default CoinTableContent;
