import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import PortfolioModal, { PortfolioModalProps } from '../app/modul/modulPage'; // Adjust the import path as necessary

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

