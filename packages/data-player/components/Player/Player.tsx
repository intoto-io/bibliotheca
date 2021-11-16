import { FunctionComponent, useState } from 'react';
import format from 'date-fns/format';

import { Grid, IconButton, Slider } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

export interface PlayerProps {
  start: Date;
  finish: Date;
  autoplay?: boolean;
}

const Player: FunctionComponent<PlayerProps> = ({
  start,
  finish,
  autoplay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  const startLabel = format(start, 'P');
  const finishLabel = format(finish, 'P');

  return (
    <Grid container alignItems="center" spacing={3}>
      <Grid item>
        {!isPlaying && (
          <IconButton onClick={play} aria-label="play">
            <PlayArrowIcon />
          </IconButton>
        )}
        {isPlaying && (
          <IconButton onClick={pause} aria-label="pause">
            <PauseIcon />
          </IconButton>
        )}
      </Grid>
      <Grid item>
        {startLabel}
      </Grid>
      <Grid item style={{ display: 'flex', flexGrow: 1 }} alignItems="center">
        <Slider />
      </Grid>
      <Grid item>
        {finishLabel}
      </Grid>
    </Grid>
  );
};

export default Player;
