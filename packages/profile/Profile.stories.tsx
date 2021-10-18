import { Story, Meta } from '@storybook/react/types-6-0';

import amotbrua from './mocks/amotbrua.json';
import amotbruaDykes from './mocks/amotbrua_dykes.json';

import Profile, { ProfileProps } from './Profile';

export default {
  title: 'Components/Profile',
  component: Profile,
} as Meta;

const Template: Story<ProfileProps> = (args) => (
  <Profile
    {...args}
  />
);

export const Default = Template.bind({});

Default.args = {
  profile: amotbrua,
};

export const WithWaterLevel = Template.bind({});

WithWaterLevel.args = {
  profile: amotbrua,
  currentWaterLevel: 7,
};

export const WithWaterLevelAndBridge = Template.bind({});

WithWaterLevelAndBridge.args = {
  profile: amotbrua,
  currentWaterLevel: 7,
  bridgeLevel: 12,
};

export const WithOverflowingWaterLevel = Template.bind({});

WithOverflowingWaterLevel.args = {
  profile: amotbruaDykes,
  currentWaterLevel: 9,
};

export const WithWaterLevelAndBridgeAndAxis = Template.bind({});

WithWaterLevelAndBridgeAndAxis.args = {
  profile: amotbrua,
  currentWaterLevel: 7,
  bridgeLevel: 12,
  axis: true,
};
