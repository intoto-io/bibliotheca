import { addDecorator } from '@storybook/react';
import { withMuiTheme } from '@harelpls/storybook-addon-materialui';

import MuiTheme from './MuiTheme';

addDecorator(withMuiTheme({
  Default: MuiTheme,
}));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
