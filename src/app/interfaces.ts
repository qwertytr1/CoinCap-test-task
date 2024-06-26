
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
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  onOpenAddCoinsModal: (coin: CurrencyEntity) => void;
  onOpenPortfolio: () => void;
}

  export interface PortfolioModalProps {
    visible: boolean;
    onClose: () => void;
    portfolio: CurrencyEntity[];
    onDelete: (id: string) => void;
    totalPortfolioValue: number;
  }
  export interface AddCoinsModalProps {
    open: boolean;
    onClose: () => void;
    coins: CurrencyEntity[];
    onAddCoins: (selectedCoins: CurrencyEntity[]) => void;
  }
  export interface CoinTableProps {
    portfolio: CurrencyEntity[];
    onAddToPortfolio: (coin: CurrencyEntity) => void;
    onDeleteCoin: (id: string) => void;
    totalPortfolioValue: number;
  }

export interface HeaderProps {
  portfolio: CurrencyEntity[];
  onOpenPortfolio: () => void;
  totalPortfolioValue: number;
}
interface ChartDataPoint {
  time: number;
  priceUsd: string;
}

export interface ChartApiResponse {
  data: ChartDataPoint[];
}

export interface CoinPageProps {
  coin: CurrencyEntity;
  onClose: () => void;
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  chartData?: {
      labels: string[];
      datasets: {
          label: string;
          data: number[];
          borderColor: string;
          fill: boolean;
      }[];
  };
}
export interface CoinSearchProps {
  searchValue: string;
  handleSearch: (value: string) => void;
}
