import React from 'react';
import { Table, Typography, Button } from 'antd';
import { CurrencyEntity } from '../interfaces';
import { formatValue } from './utils';
import styles from './style/CoinTableContent.module.scss';

const { Column } = Table;
const { Text } = Typography;
interface CoinTableContentProps {
  coins: CurrencyEntity[];
  onSelectCoin: (coinId: string) => void;
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  onOpenAddCoinsModal: () => void;
  onOpenPortfolio: () => void;
}

const CoinTableContent: React.FC<CoinTableContentProps> = ({
  coins,
  onSelectCoin,
  onAddToPortfolio,
  onOpenAddCoinsModal,
  onOpenPortfolio,
}) => {
  const uniqueCoins = Array.from(new Set(coins.map((coin) => coin.id))).map(
    (id) => coins.find((coin) => coin.id === id) as CurrencyEntity
  );

  return (
    <div className={styles.tableContainer}>
      <Table
        dataSource={uniqueCoins}
        rowKey="id"
        pagination={{ pageSize: 100 }}
        onRow={(record: CurrencyEntity) => ({
          onClick: () => {
            onSelectCoin(record.id);
          },
        })}
      >
        <Column title="#" dataIndex="rank" key="rank" />
        <Column
          title="Название монеты"
          key="name"
          render={(record: CurrencyEntity) => (
            <div className={styles.coinName}>
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
          render={(symbol) => (
            <div className={styles.coinLogo}>
              <img
                src={`https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`}
                alt="Логотип"
              />
            </div>
          )}
        />
        <Column
          title="Цена в USD"
          dataIndex="priceUsd"
          key="priceUsd"
          render={(value: string) => <div>${formatValue(value)}</div>}
          sorter
        />
        <Column
          title="Рыночная капитализация в USD"
          dataIndex="marketCapUsd"
          key="marketCapUsd"
          render={(value: string) => <div>${formatValue(value)}</div>}
          sorter
        />
        <Column
          title="Изменение за 24 часа (%)"
          dataIndex="changePercent24Hr"
          key="changePercent24Hr"
          render={(value: string) => <div>{Number(value).toFixed(2)}%</div>}
          sorter
        />
        <Column
          title="Действие"
          key="action"
          render={(record: CurrencyEntity) => (
            <div className={styles.coinButton}>

              <Button onClick={onOpenAddCoinsModal}>Добавить монету</Button>
            </div>
          )}
        />
      </Table>
    </div>
  );
};

export default CoinTableContent;