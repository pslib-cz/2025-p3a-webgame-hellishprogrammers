export type Position = {
  x: number;
  y: number;
};

export type MapGeneratingOptions = {
    seed: number,
    renderDistanceX: number,
    renderDistanceY: number,
    chunkSize: number
    positionX: number,
    positionY: number,
}

export type TileType = "water" | "grass" | "mountain" | "forest";

export type MapTile = {
    position: Position
    tileType: TileType;
    hasIcon: boolean;
}