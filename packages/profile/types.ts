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

export type ProfileShape = PolygonShape;

export type RiverProfile = ProfilePoint[];
