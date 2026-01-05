import type { TileType } from "..";
import type { BuildingType } from "./Buildings";

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
    building: BuildingType;
    position: Position;
    edges: Edge[];
    isSelected: boolean;
    rotation: number; // 0, 1, 2, 3 for 0°, 90°, 180°, 270°
    buildingInstanceId: string;
};
