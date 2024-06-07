import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import CoinSearch, { CoinSearchProps } from '../app/CoinTableElement/coinSearch';

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