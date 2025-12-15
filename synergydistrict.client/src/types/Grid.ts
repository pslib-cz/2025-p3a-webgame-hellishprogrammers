import type { BuildingPreview, BuildingTileType } from "./Buildings";

export type EdgeSide = "top" | "bottom" | "left" | "right";

export type Edge = {
    position: Position;
    side: EdgeSide;
    synergy: ActiveSynergy | null;
};

export type ActiveSynergy = {
    source: Edge | null;
    target: Edge | null;
};

export type Position = {
    x: number;
    y: number;
};

export type MapGeneratingOptions = {
    seed: number;
    chunkSize: number;
    startChunkPos: Position;
    endChunkPos: Position;
};

export type TileType = "water" | "grass" | "mountain" | "forest";

export type MapTile = {
    position: Position;
    tileType: TileType;
    hasIcon: boolean;
};

export type MapBuilding = {
    buildingType: BuildingPreview;
    position: Position;
    shape: BuildingTileType[][];
    edges: Edge[];
    isSelected: boolean;
};
