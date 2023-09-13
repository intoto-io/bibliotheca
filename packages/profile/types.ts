export interface ProfilePoint {
  x: number;
  y: number;
}

export interface PolygonShape {
  type: 'polygon';
  fill?: string;
  strokeWidth?: number;
  strokeColor?: string;
  points: ProfilePoint[];
}

export interface PathShape {
  type: 'path';
  fill?: string;
  strokeWidth?: number;
  strokeColor?: string;
  points: ProfilePoint[];
}

export type IconType = 'harbour';

export interface IconShape {
  type: 'icon';
  name: IconType;
  fill?: string;
  points: ProfilePoint[];
  width: number;
  height: number;
}

export interface BridgeShape {
  type: 'bridge';
  fill?: string;
  bridgeHeight: number;
  bridgeBottom: number;
  bridgeStrokeWidth?: number;
  bridgeStrokeColor?: string;
  bridgeBottomColor?: string;
  points: ProfilePoint[];
}

export type ProfileShape = PolygonShape | PathShape | IconShape | BridgeShape;

export interface LevelIndicator {
  name: string;
  y: number;
  showRelationToWaterLevel?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  hideLine?: boolean;
}

export type RiverProfile = ProfilePoint[];

export interface IconProps {
  width: number;
  height: number;
  transform: string;
}
