import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import PortfolioModal from '../app/modals/portfolioModal/PortfolioModal';
import { PortfolioModalProps } from '../app/interfaces';

export default {
  title: 'PortfolioModal',
  component: PortfolioModal,
} as Meta;

const Template: StoryFn<PortfolioModalProps> = (args) => <PortfolioModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  visible: true,
  onClose: () => {},


  onDelete: (id) => console.log(`Delete coin with ID: ${id}`),
  totalPortfolioValue: 0,
};

