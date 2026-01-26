import type { BuildingTileType, TileType } from "..";
import type { BuildingType, Edge, Production } from "./Buildings";

export type EdgeSide = "top" | "bottom" | "left" | "right";

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
    buildingType: BuildingType;
    position: Position;
    isSelected: boolean;
    rotation: number;
    level: number;
};

export type ActiveSynergies = {
    // activeSynergyId: string;
    sourceBuildingId: string;
    targetBuildingId: string;
    synergyProductions: Production[];
    edge: Edge;
};
