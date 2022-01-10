import { FunctionComponent } from 'react';

import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const PREFIX = 'InfoTooltip';

const classes = {
  tooltip: `${PREFIX}-tooltip`,
};

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  [`& .${classes.tooltip}`]: {
    color: theme.palette.text.disabled,
    fontSize: 16,
    marginTop: -2,
  },
}));

export interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: FunctionComponent<InfoTooltipProps> = function InfoTooltip({ text }) {
  return (
    <StyledTooltip
      title={text}
      enterTouchDelay={0}
      placement="bottom"
      arrow
    >
      <IconButton aria-label="info" size="small">
        <InfoIcon className={classes.tooltip} fontSize="small" />
      </IconButton>
    </StyledTooltip>
  );
};

export default InfoTooltip;
