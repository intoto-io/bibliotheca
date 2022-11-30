export interface ProfilePoint {
  x: number;
  y: number;
}

export interface ProfileShape {
  fill?: string;
  strokeWidth?: number;
  strokeColor?: string;
  points: ProfilePoint[];
}

export type RiverProfile = ProfilePoint[];
