// eslint-disable-next-line import/no-extraneous-dependencies
import { Story, Meta } from '@storybook/react/types-6-0';

import ProfileSVG, { ProfileSVGProps } from './ProfileSVG';
import ArtBoard from './mocks/whereArtboard.svg';

export default {
  title: 'Components/Profile',
  component: ProfileSVG,
} as Meta;

const Template: Story<ProfileSVGProps> = function Template(args) {
  return <ProfileSVG {...args} />;
};

export const WithDynamicScene = Template.bind({});

WithDynamicScene.args = {
  waterHeight: 3.5,
  waterHeightFactor: 28.41,
  svgPath: ArtBoard,
  svgString: '',
};
