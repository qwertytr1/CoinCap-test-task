import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Header from '../app/header/header';
import { CurrencyEntity } from '../app/interfaces';

interface HeaderProps {
  portfolio: CurrencyEntity[];
  onOpenPortfolio: () => void;
  totalPortfolioValue: number;
}

export default {
  title: 'Header',
  component: Header,
} as Meta;

const Template: StoryFn<HeaderProps> = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  portfolio: [],
  totalPortfolioValue: 0,
  onOpenPortfolio: () => {},
};
