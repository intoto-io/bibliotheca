import {
  cloneElement,
  ReactElement,
  RefObject,
} from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const defaultStyles = {
  position: 'absolute',
  backgroundColor: 'white',
  color: '#666666',
  borderRadius: '3px',
  fontSize: '14px',
  boxShadow: '0 1px 2px rgba(33,33,33,0.2)',
  lineHeight: '1em',
  pointerEvents: 'none',
};

interface TooltipProps {
  tooltipRef?: RefObject<HTMLDivElement>;
  position: {
    x: number;
    y: number;
    tx: number;
    ty: number;
  };
  values: {
    name: string;
    value: string;
    color?: string;
    isSmall?: boolean;
    extraContent?: ReactElement | null;
  }[];
  bottomText?: string;
}

function Tooltip({
  tooltipRef,
  position,
  values,
  bottomText,
}: TooltipProps) {
  return (
    <Box
      ref={tooltipRef}
      className="GraphTooltip"
      sx={{
        ...defaultStyles,
        transform: 'translateY(-50%)',
        zIndex: 10,
        px: 2,
        py: 1.5,
      }}
      style={{
        top: position.ty,
        left: position.tx,
      }}
    >
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
              <Typography variant="subtitle2">
                {`${item.name}`}
              </Typography>
              <Box
                sx={{
                  color,
                  marginTop: '6px',
                  fontSize: item.isSmall ? undefined : '1.5rem',
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
        <Box sx={{ marginTop: '12px' }}>
          <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
            {bottomText}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Tooltip;
