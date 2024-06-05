import React, { useState } from 'react';
import { Table, Typography, Button } from 'antd';
import { CurrencyEntity } from '../interfaces';
import { formatValue } from './utils';
import AddCoinsModal from '../modul/addCoins';

const { Column } = Table;
const { Text } = Typography;

interface CoinTableContentProps {
  coins: CurrencyEntity[];
  onSelectCoin: (coinId: string) => void;
  onAddToPortfolio: (coins: CurrencyEntity[], quantity: number) => void;
  onOpenAddCoinsModal: () => void; // Add this property to the interface
}

const CoinTableContent: React.FC<CoinTableContentProps> = ({ coins, onSelectCoin, onAddToPortfolio, onOpenAddCoinsModal }) => {
  const [selectedCoinToAdd, setSelectedCoinToAdd] = useState<CurrencyEntity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);

  const uniqueCoins = Array.from(new Set(coins.map(coin => coin.id)))
    .map(id => coins.find(coin => coin.id === id) as CurrencyEntity);

  const handleAddCoin = () => {
    if (selectedCoinToAdd && quantity > 0) {
      onAddToPortfolio([selectedCoinToAdd], quantity);
      setIsModalOpen(false);
      setQuantity(0);
    }
  };

  return (
    <div>
      <Table
        dataSource={uniqueCoins}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            onSelectCoin(record.id);
          },
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
          sorter={(a: CurrencyEntity, b: CurrencyEntity) => parseFloat(a.priceUsd) - parseFloat(b.priceUsd)}
        />
        <Column
          title="Рыночная капитализация в USD"
          dataIndex="marketCapUsd"
          key="marketCapUsd"
          render={(value: string) => `$${formatValue(value)}`}
          sorter={(a: CurrencyEntity, b: CurrencyEntity) => parseFloat(a.marketCapUsd) - parseFloat(b.marketCapUsd)}
        />
        <Column
          title="Изменение за 24 часа (%)"
          dataIndex="changePercent24Hr"
          key="changePercent24Hr"
          render={(value: string) => `${Number(value).toFixed(2)}%`}
          sorter={(a: CurrencyEntity, b: CurrencyEntity) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr)}
        />
        <Column
          title="Добавить в портфель"
          key="add"
          render={(record: CurrencyEntity) => (
            <Button
              onClick={() => {
                setSelectedCoinToAdd(record);
                setIsModalOpen(true);
              }}
            >
              Добавить
            </Button>
          )}
        />
      </Table>

      <AddCoinsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coins={selectedCoinToAdd ? [selectedCoinToAdd] : []}
        onAddCoins={handleAddCoin}
      />
    </div>
  );
};

export default CoinTableContent;
