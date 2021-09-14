import { Story, Meta } from '@storybook/react/types-6-0';

import Info, { InfoProps } from './Info';

export default {
  title: 'Components/Info',
  component: Info,
} as Meta;

const Template: Story<InfoProps> = (args) => <Info {...args} />;

export const Default = Template.bind({});

Default.args = {
  text: 'This is an info component',
};
