// eslint-disable-next-line import/no-extraneous-dependencies
import { Story, Meta } from '@storybook/react/types-6-0';

import amotbrua from './mocks/amotbrua.json';
import amotbruaDykes from './mocks/amotbrua_dykes.json';

import Profile, { ProfileProps } from './Profile';

export default {
  title: 'Components/Profile',
  component: Profile,
} as Meta;

const Template: Story<ProfileProps> = function Template(args) {
  return (
    <Profile
      {...args}
    />
  );
};

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
  shapes: [{
    type: 'bridge',
    bridgeHeight: 1.2,
    bridgeBottom: 2.3,
    points: [
      { x: 0, y: 12 },
      { x: 5, y: 12 },
      { x: 42.64, y: 12 },
      { x: 46.64, y: 12 },
    ],
  }],
};

export const WithOverflowingWaterLevel = Template.bind({});

WithOverflowingWaterLevel.args = {
  profile: amotbruaDykes,
  currentWaterLevel: 9,
};

export const WithWaterLevelAndAxis = Template.bind({});

WithWaterLevelAndAxis.args = {
  profile: amotbrua,
  currentWaterLevel: 7,
  axis: true,
};

export const WithWaterLevelAndBridgeAndAxisAndMean = Template.bind({});

WithWaterLevelAndBridgeAndAxisAndMean.args = {
  profile: amotbrua,
  currentWaterLevel: 4.2,
  axis: true,
  meanLevel: 3.415,
  shapes: [{
    type: 'bridge',
    bridgeHeight: 1.2,
    bridgeBottom: 0.5,
    points: [
      { x: 0, y: 9.8 },
      { x: 5, y: 9.8 },
      { x: 42.64, y: 9.8 },
      { x: 46.64, y: 9.8 },
    ],
  }],
};

export const WithoutProfile = Template.bind({});

WithoutProfile.args = {
  currentWaterLevel: 4.2,
  minWaterLevel: 1.4,
  axis: true,
  meanLevel: 3.415,
};

export const WithoutProfileWithWalls = Template.bind({});

WithoutProfileWithWalls.args = {
  currentWaterLevel: 4.2,
  minWaterLevel: 1.4,
  axis: true,
  meanLevel: 3.415,
  riverWidth: 20,
  shapes: [
    {
      type: 'polygon',
      strokeWidth: 1,
      points: [
        { x: 0, y: 6 },
        { x: 3, y: 6 },
        { x: 3, y: 1.4 },
        { x: 0, y: 1.4 },
      ],
    },
    {
      type: 'polygon',
      strokeWidth: 1,
      points: [
        { x: 17, y: 6 },
        { x: 20, y: 6 },
        { x: 20, y: 1.4 },
        { x: 17, y: 1.4 },
      ],
    },
  ],
};

export const WithoutProfileWithSlopes = Template.bind({});

WithoutProfileWithSlopes.args = {
  currentWaterLevel: 4.2,
  axis: true,
  meanLevel: 3.415,
  riverWidth: 20,
  shapes: [
    {
      type: 'polygon',
      strokeWidth: 1,
      points: [
        { x: 0, y: 6 },
        { x: 1, y: 6 },
        { x: 4, y: 1.4 },
        { x: 0, y: 1.4 },
      ],
    },
    {
      type: 'polygon',
      strokeWidth: 1,
      points: [
        { x: 19, y: 6 },
        { x: 20, y: 6 },
        { x: 20, y: 1.4 },
        { x: 16, y: 1.4 },
      ],
    },
  ],
};

export const NoBottomWithWall = Template.bind({});

NoBottomWithWall.args = {
  currentWaterLevel: 4.2,
  axis: true,
  meanLevel: 3.415,
  riverWidth: 20,
  shapes: [
    {
      type: 'polygon',
      strokeWidth: 0,
      points: [
        { x: 0, y: 6 },
        { x: 3, y: 6 },
        { x: 3, y: 1.4 },
        { x: 0, y: 1.4 },
      ],
    },
    {
      type: 'path',
      strokeWidth: 1.5,
      points: [
        { x: 0, y: 6 },
        { x: 3, y: 6 },
        { x: 3, y: 1.4 },
      ],
    },
  ],
};

export const Harbour = Template.bind({});

Harbour.args = {
  currentWaterLevel: 4.2,
  axis: true,
  meanLevel: 3.415,
  riverWidth: 20,
  shapes: [
    {
      type: 'polygon',
      strokeWidth: 0,
      points: [
        { x: 0, y: 6 },
        { x: 4, y: 6 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 3, y: 1.4 },
        { x: 0, y: 1.4 },
      ],
    },
    {
      type: 'path',
      strokeWidth: 1.5,
      points: [
        { x: 0, y: 6 },
        { x: 4, y: 6 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 3, y: 1.4 },
      ],
    },
    {
      type: 'icon',
      name: 'harbour',
      points: [{ x: 2.8, y: 7.1 }],
      width: 1.36,
      height: 1,
    },
  ],
};
