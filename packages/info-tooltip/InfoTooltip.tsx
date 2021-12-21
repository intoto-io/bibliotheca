import { FunctionComponent } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    color: theme.palette.text.disabled,
    fontSize: 16,
    marginTop: -2,
  },
}));

export interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: FunctionComponent<InfoTooltipProps> = function InfoTooltip({ text }) {
  const styles = useStyles();

  return (
    <Tooltip
      title={text}
      enterTouchDelay={0}
      placement="bottom"
      arrow
    >
      <IconButton aria-label="info" size="small">
        <InfoIcon className={styles.tooltip} fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default InfoTooltip;
