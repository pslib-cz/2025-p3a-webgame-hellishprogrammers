import type { BuildingTileType, BuildingCategory, StatsType } from "..";

export type BuildingSynergy = {
    sourceBuildingId: number;
    targetBuildingId: number;
    synergyProduction: Production[];
};

export type Production = {
    type: StatsType;
    value: number;
};

export type BuildingType = {
    buildingId: number;
    name: string;
    type: BuildingCategory;
    description: string;
    iconKey: string;
    cost: number;
    shape: BuildingTileType[][];
    baseProduction: Production[];
};
