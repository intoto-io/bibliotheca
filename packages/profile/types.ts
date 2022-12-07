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

export type ProfileShape = PolygonShape | PathShape;

export type RiverProfile = ProfilePoint[];
