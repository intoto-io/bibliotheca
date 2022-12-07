import { IconProps, IconType } from '../types';

import Harbour from './icons/Harbour';

interface IconComponentProps extends IconProps {
  name: IconType;
}

function Icon({
  width,
  height,
  transform,
  name,
}: IconComponentProps) {
  if (name === 'harbour') {
    return <Harbour width={width} height={height} transform={transform} />;
  }

  return null;
}

export default Icon;
