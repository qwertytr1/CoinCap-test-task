import React from 'react';
import { Table, Typography, Button } from 'antd';
import { CurrencyEntity, CoinTableContentProps } from '../../interfaces';
import { formatValue } from '../../utils/utils';
import styles from './CoinTableContent.module.scss';
import { useNavigate } from 'react-router-dom';

const { Column } = Table;
const { Text } = Typography;

const CoinTableContent: React.FC<CoinTableContentProps> = ({
  coins,
  onSelectCoin,
  onOpenAddCoinsModal,
}) => {
  const navigate = useNavigate();
  const uniqueCoins = Array.from(new Set(coins.map((coin) => coin.id))).map(
    (id) => coins.find((coin) => coin.id === id) as CurrencyEntity
  );

  const handleButtonClick = (event: React.MouseEvent, coin: CurrencyEntity) => {
    event.stopPropagation();
    onOpenAddCoinsModal(coin);
  };

  return (
    <div className={styles.tableContainer}>
      <Table
        dataSource={uniqueCoins}
        rowKey="id"
        onRow={(record: CurrencyEntity) => ({
          onClick: () => {
            navigate(`/coin/${record.rank}`);
            onSelectCoin(record.id);
          },
        })}
      >
        <Column title="#" dataIndex="rank" key="rank" responsive={['lg']} />
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
          render={(value: string) => {
            const parsedValue = parseFloat(value);
            return parsedValue !== 0 ? <div>${formatValue(value)}</div> : null;
          }}
          sorter={(a: CurrencyEntity, b: CurrencyEntity) => parseFloat(a.priceUsd) - parseFloat(b.priceUsd)}
        />
        <Column
          title="Рыночная капитализация в USD"
          dataIndex="marketCapUsd"
          key="marketCapUsd"
          render={(value: string) => {
            const parsedValue = parseFloat(value);
            return parsedValue !== 0 ? <div>${formatValue(value)}</div> : null;
          }}
          sorter={(a: CurrencyEntity, b: CurrencyEntity) => parseFloat(a.marketCapUsd) - parseFloat(b.marketCapUsd)}
          responsive={['md']}
        />
        <Column
          title="Изменение за 24 часа (%)"
          dataIndex="changePercent24Hr"
          key="changePercent24Hr"
          render={(value: string) => {
            const parsedValue = parseFloat(value);
            return parsedValue !== 0 ? <div>{Number(value).toFixed(2)}%</div> : null;
          }}
          sorter={(a: CurrencyEntity, b: CurrencyEntity) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr)}
          responsive={['lg']}
        />
        <Column
          title="Действие"
          key="action"
          render={(record: CurrencyEntity) => (
            <div className={styles.coinButton}>
              <Button onClick={(event) => { handleButtonClick(event, record) }}>Добавить монету</Button>
            </div>
          )}
          responsive={['sm']}
        />
      </Table>
    </div>
  );
};

export default CoinTableContent;
