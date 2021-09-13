import { FunctionComponent } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    color: theme.palette.text.disabled,
    fontSize: 16,
    marginTop: -2,
  },
}));

export interface InfoProps {
  text: string;
}

const Info: FunctionComponent<InfoProps> = ({ text }) => {
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

export default Info;
