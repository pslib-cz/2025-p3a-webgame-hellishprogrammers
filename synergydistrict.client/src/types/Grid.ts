export type Coordinates = {
  x: number;
  y: number;
};

export type TileType = "water" | "grass" | "mountain" | "forest";

export type MapTile = {
    type: TileType;
    icon: boolean;
}