import { FunctionComponent, useMemo, useState, useEffect, useRef } from 'react';
import format from 'date-fns/format';

import { Grid, IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export interface PlayerProps {
  dates: string[];
  currentDate?: string;
  autoplay?: boolean;
  onUpdateDate?: (date: string) => void;
  playbackSpeed?: number;
}

const Player: FunctionComponent<PlayerProps> = function Player({
  dates,
  currentDate = dates[0],
  autoplay = false,
  onUpdateDate,
  playbackSpeed = 1000, // Default to 1 second intervals
}) {
  const datesSorted = useMemo(() => dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()), [dates]);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const value = datesSorted.findIndex((date) => date === currentDate);
  const animationFrameRef = useRef<number>();
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;

      const elapsed = timestamp - lastUpdateTime.current;

      if (elapsed >= playbackSpeed) {
        const nextIndex = (value + 1) % datesSorted.length;
        if (onUpdateDate) {
          onUpdateDate(datesSorted[nextIndex]);
        }
        lastUpdateTime.current = timestamp;
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, value, datesSorted, onUpdateDate, playbackSpeed]);

  const play = () => setIsPlaying(true);
  const pause = () => {
    setIsPlaying(false);
    lastUpdateTime.current = 0;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const startLabel = format(new Date(datesSorted[0]), 'P');
  const finishLabel = format(new Date(datesSorted[datesSorted.length - 1]), 'P');

  return (
    <Grid container alignItems="center" spacing={3}>
      <Grid item>
        {!isPlaying && (
          <IconButton onClick={play} aria-label="play" size="large">
            <PlayArrowIcon />
          </IconButton>
        )}
        {isPlaying && (
          <IconButton onClick={pause} aria-label="pause" size="large">
            <PauseIcon />
          </IconButton>
        )}
      </Grid>
      <Grid item>{startLabel}</Grid>
      <Grid item style={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
        <Slider
          min={0}
          max={datesSorted.length - 1}
          value={value}
          onChange={(event, newValue) => {
            const index = Array.isArray(newValue) ? newValue[0] : newValue;

            if (onUpdateDate) {
              onUpdateDate(datesSorted[index]);
            }
          }}
        />
      </Grid>
      <Grid item>{finishLabel}</Grid>
    </Grid>
  );
};

export default Player;
