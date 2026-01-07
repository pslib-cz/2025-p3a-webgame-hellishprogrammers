import type { BuildingTileType, TileType } from "..";
import type { BuildingType, Production } from "./Buildings";

export type EdgeSide = "top" | "bottom" | "left" | "right";

export type Edge = {
    position: Position;
    side: EdgeSide;
    synergy: ActiveSynergies | null;
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
    MapBuildingId: string;
    building: BuildingType;
    position: Position;
    isSelected: boolean;
    rotation: number;
    edges: Edge[];
    shape: BuildingTileType[][];
};

export type ActiveSynergies = {
    activeSynergyId: number;
    targetBuildingId: number;
    synergyProduction: Production[];
};
