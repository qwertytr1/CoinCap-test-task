import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import CoinPage from '../app/CoinPages/CoinPage';
import { CurrencyEntity } from '../app/interfaces';

export default {
  title: 'Components/CoinPage',
  component: CoinPage,
} as Meta;

interface TemplateProps {
  coin: CurrencyEntity;
  onClose: () => void;
  onAddToPortfolio: (coin: CurrencyEntity) => void;
  chartData?: any;
}

const Template: StoryFn<TemplateProps> = (args) => <CoinPage {...args} />;

export const Default = Template.bind({});
Default.args = {
  coin: {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    priceUsd: '40000',
    quantity: 2,
    rank: '1',
    supply: '18723125',
    maxSupply: '21000000',
    marketCapUsd: '750,000,000,000',
    volumeUsd24Hr: '0',
    changePercent24Hr: '0',
    vwap24Hr: '0',
    explorer: '',
    purchasePrice: 0,
  },
  onClose: () => {},
  onAddToPortfolio: (coin: CurrencyEntity) => {},
  chartData: {
    labels: ['2024-01-01', '2024-01-02', '2024-01-03'],
    datasets: [{
      label: 'Mock Data',
      data: [100, 200, 150],
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }],
  },
};
