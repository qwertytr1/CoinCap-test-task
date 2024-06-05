import React from 'react';
import { Table, Typography, Button } from 'antd';
import { CurrencyEntity } from '../interfaces';
import { formatValue } from './utils';

const { Column } = Table;
const { Text } = Typography;

interface CoinTableContentProps {
  coins: CurrencyEntity[];
  onSelectCoin: (coinId: string) => void;
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  onOpenAddCoinsModal: () => void;
  onOpenPortfolio: () => void;
}

const CoinTableContent: React.FC<CoinTableContentProps> = ({ coins, onSelectCoin, onAddToPortfolio, onOpenAddCoinsModal, onOpenPortfolio }) => {

  const uniqueCoins = Array.from(new Set(coins.map(coin => coin.id)))
    .map(id => coins.find(coin => coin.id === id) as CurrencyEntity);

  return (
    <div>
      <Table
        dataSource={uniqueCoins}
        rowKey="id"
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
          title="Действие"
          key="action"
          render={(record: CurrencyEntity) => (
            <div>
              <Button onClick={() => onAddToPortfolio(record)}>Добавить монету</Button>
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default CoinTableContent;
