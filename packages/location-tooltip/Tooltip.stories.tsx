// eslint-disable-next-line import/no-extraneous-dependencies
import { Story, Meta } from '@storybook/react/types-6-0';

import Tooltip, { TooltipProps } from './Tooltip';

export default {
  title: 'Components/LocationTooltip',
  component: Tooltip,
  argTypes: {
    anchor: {
      options: ['top', 'bottom', 'left', 'right'],
      control: { type: 'radio' },
    },
  },
} as Meta;

const Template: Story<TooltipProps> = function Template(args) {
  const { position } = args;

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: position.x - 3,
          top: position.y - 3,
          height: 6,
          width: 6,
          background: '#000',
          overflow: 'hidden',
          borderRadius: '50%',
        }}
      />
      <Tooltip {...args} />
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  anchor: 'left',
  position: {
    x: 200,
    y: 200,
  },
  values: [{
    name: 'Some title',
    value: '100%!',
  }],
};

export const WithMultipleValues = Template.bind({});

WithMultipleValues.args = {
  ...Default.args,
  anchor: 'top',
  values: [{
    name: 'First value',
    value: '100%!',
    color: '#ff0000',
  }, {
    name: 'Second value',
    value: '200%!',
    color: '#00ff00',
  }],
};

export const BottomText = Template.bind({});

BottomText.args = {
  ...Default.args,
  anchor: 'bottom',
  bottomText: 'Some bottom text',
};

export const ExtraContent = Template.bind({});

ExtraContent.args = {
  ...Default.args,
  anchor: 'right',
  values: [{
    name: 'Some title',
    value: 'Data is missing :(',
    isSmall: true,
    extraContent: <div style={{ marginTop: '1em' }}>Some extra JSX content</div>,
  }],
  bottomText: 'Some bottom text',
};

export const WithPointer = Template.bind({});

WithPointer.args = {
  ...Default.args,
  anchor: 'top',
  withPointer: true,
};
