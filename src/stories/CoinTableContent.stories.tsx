import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import CoinTableContent, { CoinTableContentProps } from '../app/CoinTableElement/coinTableContent';
import { CurrencyEntity } from '../app/interfaces';

export default {
  title: 'CoinTableContent',
  component: CoinTableContent,
} as Meta;

const Template: StoryFn<CoinTableContentProps> = (args) => <CoinTableContent {...args} />;

export const Default = Template.bind({});
Default.args = {
  coins: [
    {
      id: '1',
      rank: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      supply: '18723125',
      maxSupply: '21000000',
      marketCapUsd: '750,000,000,000',
      volumeUsd24Hr: '1000000000',
      priceUsd: '50000',
      changePercent24Hr: '1.5',
      vwap24Hr: '48000',
      explorer: 'https://blockchain.info/',
      quantity: 0,
      purchasePrice: 0,
    },
  ],
  onSelectCoin: (coinId: string) => {
    console.log('Selected coin:', coinId);
  },
  onAddToPortfolio: (coin: CurrencyEntity) => {
    console.log('Adding to portfolio:', coin);
  },
  onOpenAddCoinsModal: () => {
    console.log('Opening add coins modal');
  },
  onOpenPortfolio: () => {
    console.log('Opening portfolio');
  },
  onTableChange: (pagination: any, filters: any, sorter: any) => {
    console.log('Table changed:', pagination, filters, sorter);
  },
  total: 1,
  pageSize: 10,
  currentPage: 1,
};