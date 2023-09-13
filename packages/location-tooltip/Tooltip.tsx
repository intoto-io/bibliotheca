import { cloneElement, ReactElement, RefObject, useMemo } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const defaultStyles = {
  position: 'absolute',
  backgroundColor: 'white',
  color: '#666666',
  borderRadius: '3px',
  fontSize: '14px',
  filter: 'drop-shadow(0 1px 2px rgba(33,33,33,0.2))',
  lineHeight: '1em',
};

export interface TooltipProps {
  position: {
    x: number;
    y: number;
  };
  values: {
    name: string;
    value: string;
    color?: string;
    isSmall?: boolean;
    extraContent?: ReactElement | null;
  }[];
  tooltipRef?: RefObject<HTMLDivElement>;
  anchor?: 'top' | 'bottom' | 'left' | 'right';
  withPointer?: boolean;
  bottomText?: string;
  allowInteraction?: boolean;
  isCompact?: boolean;
}

function Tooltip({
  tooltipRef,
  position,
  values,
  bottomText,
  anchor = 'left',
  withPointer,
  allowInteraction = true,
  isCompact = false,
}: TooltipProps) {
  const [extraStyles, triangleStyles] = useMemo(() => {
    switch (anchor) {
      case 'top':
        return [
          {
            transform: 'translate(-50%, -100%)',
            marginTop: withPointer ? '-15px' : 0,
          },
          {
            left: '50%',
            bottom: 0,
            transform: 'translate(-50%, 100%)',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '15px solid #fff',
          },
        ];
      case 'bottom':
        return [
          {
            transform: 'translate(-50%, 0)',
            marginTop: withPointer ? '15px' : 0,
          },
          {
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -100%)',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '15px solid #fff',
          },
        ];
      case 'right':
        return [
          {
            transform: 'translate(-100%, -50%)',
            marginLeft: withPointer ? '-15px' : 0,
          },
          {
            right: 0,
            top: '50%',
            transform: 'translate(100%, -50%)',
            borderLeft: '15px solid #fff',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
          },
        ];
      case 'left':
      default:
        return [
          {
            transform: 'translate(0, -50%)',
            marginLeft: withPointer ? '15px' : 0,
          },
          {
            left: 0,
            top: '50%',
            transform: 'translate(-100%, -50%)',
            borderRight: '15px solid #fff',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
          },
        ];
    }
  }, [anchor, withPointer]);

  return (
    <Box
      ref={tooltipRef}
      className="GraphTooltip"
      sx={{
        ...defaultStyles,
        zIndex: 10,
        px: isCompact ? 1.5 : 2,
        py: 1.5,
      }}
      style={{
        ...extraStyles,
        pointerEvents: allowInteraction ? 'auto' : 'none',
        top: position.y,
        left: position.x,
      }}
    >
      {withPointer && (
        <Box
          sx={{
            position: 'absolute',
            width: 0,
            height: 0,
            ...triangleStyles,
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {values.map((item) => {
          const color = item.color ? item.color : '#000';

          return (
            <Box
              key={item.name}
              sx={{
                whiteSpace: 'nowrap',
                margin: '0 8px',
                '&:first-of-type': {
                  marginLeft: 0,
                },
                '&:last-child': {
                  marginRight: 0,
                },
              }}
            >
              {!isCompact && <Typography variant="subtitle2">{`${item.name}`}</Typography>}
              <Box
                sx={{
                  color,
                  marginTop: isCompact ? 0 : 1,
                  fontSize: item.isSmall ? '1rem' : '1.5rem',
                  lineHeight: '1.3rem',
                }}
              >
                {item.value}
              </Box>
              {item.extraContent && cloneElement(item.extraContent)}
            </Box>
          );
        })}
      </Box>
      {bottomText && (
        <Box sx={{ marginTop: isCompact ? 1 : 2 }}>
          <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
            {bottomText}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Tooltip;
