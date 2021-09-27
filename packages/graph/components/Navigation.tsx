import {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { curveBasis } from '@visx/curve';
import { LinePath } from '@visx/shape';
import { Brush } from '@visx/brush';
import BaseBrush, { UpdateBrush, BaseBrushState } from '@visx/brush/lib/BaseBrush';
import { Bounds } from '@visx/brush/lib/types';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { createXScale, createYScale } from '../helpers/createScales';
import { GraphSeries } from '../types';

const useStyles = makeStyles<Theme, { paddingLeft: number }>({
  navigationContainer: {
    marginLeft: (props) => props.paddingLeft,
  },
});

interface NavigationProps {
  width: number;
  dates: Date[];
  series: GraphSeries[];
  range: [number, number];
  setRange: (range: [number, number]) => void;
  paddingLeft?: number;
  paddingRight?: number;
}

const Navigation: FunctionComponent<NavigationProps> = ({
  width,
  dates,
  series,
  range,
  setRange,
  paddingLeft = 0,
  paddingRight = 0,
}) => {
  const styles = useStyles({ paddingLeft });
  const brushRef = useRef<BaseBrush | null>(null);
  const skipChange = useRef(false);

  const height = 50;
  const navWidth = Math.max(width - paddingLeft - paddingRight, 0);

  const xScale = createXScale(dates, navWidth);
  const rangeRef = useRef<[number, number]>([xScale(range[0]), xScale(range[1])]);

  const yScales = useMemo(
    () => series.map((plot) => createYScale(
      plot,
      height - 4,
    )),
    [height, series],
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: xScale(range[0]) },
      end: { x: xScale(range[1]) },
    }),
    [range, xScale],
  );

  useEffect(() => {
    rangeRef.current = [xScale(range[0]), xScale(range[1])];
  }, [range, xScale]);

  useEffect(() => {
    function handleResize() {
      if (brushRef.current) {
        const updater: UpdateBrush = (prevBrush) => {
          if (brushRef.current) {
            const newExtent = brushRef.current.getExtent(
              { x: rangeRef.current[0] },
              { x: rangeRef.current[1] },
            );

            const newState: BaseBrushState = {
              ...prevBrush,
              start: { y: newExtent.y0, x: newExtent.x0 },
              end: { y: newExtent.y1, x: newExtent.x1 },
              extent: newExtent,
              isBrushing: false,
            };

            return newState;
          }

          return prevBrush;
        };

        skipChange.current = true;
        brushRef.current.updateBrush(updater);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;

    if (skipChange.current) {
      skipChange.current = false;
      return;
    }

    const {
      x0,
      x1,
    } = domain;

    setRange([x0, x1]);
  };

  if (navWidth === 0) {
    return null;
  }

  return (
    <svg className={styles.navigationContainer} width={navWidth} height={height}>
      {series.map((plot, index) => (
        <LinePath
          key={plot.key}
          curve={curveBasis}
          data={plot.data}
          x={(datum) => xScale(datum.date)}
          y={(datum) => yScales[index](datum.value)}
          stroke="#666"
          strokeWidth={1}
          strokeOpacity={1}
        />
      ))}
      <Brush
        xScale={xScale}
        yScale={yScales[0]}
        width={navWidth}
        height={height}
        innerRef={brushRef}
        handleSize={8}
        resizeTriggerAreas={['left', 'right']}
        brushDirection="horizontal"
        initialBrushPosition={initialBrushPosition}
        onChange={onBrushChange}
      />
    </svg>
  );
};

export default Navigation;
