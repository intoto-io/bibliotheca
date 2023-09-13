// eslint-disable-next-line import/no-extraneous-dependencies
import { Story, Meta } from "@storybook/react/types-6-0";

import Player, { PlayerProps } from "./Player";

export default {
  title: "Components/Data-Player/Player",
  component: Player,
} as Meta;

const Template: Story<PlayerProps> = function Template(args) {
  return (
    <div style={{ marginTop: "2em" }}>
      <Player {...args} />
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {};
