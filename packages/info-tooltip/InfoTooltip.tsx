import { FunctionComponent } from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

export interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: FunctionComponent<InfoTooltipProps> = function InfoTooltip({ text }) {
  return (
    <Tooltip
      title={text}
      enterTouchDelay={0}
      placement="bottom"
      arrow
    >
      <IconButton aria-label="info" size="small">
        <InfoIcon
          fontSize="small"
          sx={{
            color: 'text.disabled',
            fontSize: 16,
            marginTop: '-2px',
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default InfoTooltip;
