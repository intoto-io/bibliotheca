export interface ProfilePoint {
  x: number;
  y: number;
}

export interface PolygonShape {
  type: 'polygon',
  fill?: string;
  strokeWidth?: number;
  strokeColor?: string;
  points: ProfilePoint[];
}

export interface PathShape {
  type: 'path',
  fill?: string;
  strokeWidth?: number;
  strokeColor?: string;
  points: ProfilePoint[];
}

export type IconType = 'harbour';

export interface IconShape {
  type: 'icon',
  name: IconType,
  fill?: string;
  points: ProfilePoint[];
  width: number;
  height: number;
}

export type ProfileShape = PolygonShape | PathShape | IconShape;

export type RiverProfile = ProfilePoint[];

export interface IconProps {
  width: number;
  height: number;
  transform: string;
}
