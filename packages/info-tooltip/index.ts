import { Theme } from '@mui/material/styles';

import InfoTooltip from './InfoTooltip';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export { InfoTooltip };

export default InfoTooltip;
