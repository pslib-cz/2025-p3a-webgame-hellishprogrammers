import type { BuildingTileType, BuildingType, StatsType } from "..";

export type BuildingSynergy = {
    sourceBuildingId: number;
    targetBuildingId: number;
    synergyProduction: Production[];
};

export type Production = {
    type: StatsType;
    value: number;
};

export type Building = {
    buildingId: number;
    name: string;
    type: BuildingType;
    description: string;
    iconKey: string;
    cost: number;
    shape: BuildingTileType[][];
    baseProduction: Production[];
    synergies: BuildingSynergy[];
};
