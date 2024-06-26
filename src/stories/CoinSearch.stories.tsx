import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import CoinSearch from '../app/coinTableElement/coinSearch/CoinSearch';
import { CoinSearchProps } from '../app/interfaces';

export default {
  title: 'CoinSearch',
  component: CoinSearch,
} as Meta;

const Template: StoryFn<CoinSearchProps> = (args) => <CoinSearch {...args} />;

export const Default = Template.bind({});
Default.args = {
  searchValue: '',
  handleSearch: (value: string) => {

  },
};