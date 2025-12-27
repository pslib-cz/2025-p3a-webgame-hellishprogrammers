import type { TileType } from "..";
import type { Building } from "./Buildings";

export type EdgeSide = "top" | "bottom" | "left" | "right";

export type Edge = {
    // buildingId: number;
    position: Position;
    side: EdgeSide;
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

export type MapTile = {
    position: Position;
    tileType: TileType;
    hasIcon: boolean;
};

export type MapBuilding = {
    building: Building;
    position: Position;
    edges: Edge[];
    isSelected: boolean;
};
