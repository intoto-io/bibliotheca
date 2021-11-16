import { Story, Meta } from '@storybook/react/types-6-0';

import Player, { PlayerProps } from './Player';

export default {
  title: 'Components/Player',
  component: Player,
} as Meta;

const Template: Story<PlayerProps> = (args) => (
  <Player {...args} />
);

export const Default = Template.bind({});

Default.args = {
  start: new Date(2021, 5, 16, 16, 0, 0),
  finish: new Date(2021, 6, 16, 16, 0, 0),
};
