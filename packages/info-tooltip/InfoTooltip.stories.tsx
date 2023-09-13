// eslint-disable-next-line import/no-extraneous-dependencies
import { Story, Meta } from '@storybook/react/types-6-0';

import InfoTooltip, { InfoTooltipProps } from './InfoTooltip';

export default {
  title: 'Components/Info',
  component: InfoTooltip,
} as Meta;

const Template: Story<InfoTooltipProps> = function Template(args) {
  return <InfoTooltip {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  text: 'Provide the tooltip text through `text`',
};
