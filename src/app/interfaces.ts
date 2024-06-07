
export interface CurrencyEntity {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
  quantity: number;
  purchasePrice: number;
}
export interface CoinTableContentProps {
    coins: CurrencyEntity[];
    onSelectCoin: (coinId: string) => void;
  }
export interface NormalizedCurrencyEntity {
    [key: string]: CurrencyEntity;
}

export interface UseStore {
        allCurrencies: NormalizedCurrencyEntity | undefined;
        isLoading: boolean;
}
export interface CustomChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}