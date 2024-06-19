import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import AddCoinsModal from '../app/Moduls/AddCoinsModal';
import { AddCoinsModalProps } from '../app/interfaces';

export default {
  title: 'Components/AddCoinsModal',
  component: AddCoinsModal,
} as Meta;

const Template: StoryFn<AddCoinsModalProps> = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <AddCoinsModal {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
    coins: [
      {
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
      {
        id: '2',
        name: 'Ethereum',
        symbol: 'ETH',
        priceUsd: '2500',
        quantity: 5,
        rank: '2',
        supply: '116293156',
        maxSupply: 'null',
        marketCapUsd: '300,000,000,000',
        volumeUsd24Hr: '0',
        changePercent24Hr: '0',
        vwap24Hr: '0',
        explorer: '',
        purchasePrice: 0,
      },
    ],
    onAddCoins: (selectedCoins) => console.log('Adding coins:', selectedCoins),
  };
