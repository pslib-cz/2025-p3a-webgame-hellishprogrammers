import type { BuildingTileType, BuildingType, StatsType } from "..";

export type SynergyBuilding = {
    buildingId: number;
    name: string;
    category: BuildingType;
    colorHex: string;
};

export type BuildingSynergy = {
    sourceBuildingId: SynergyBuilding;
    targetBuildingId: SynergyBuilding;
    productionBonuses: Production[];
};

export type Production = {
    resourceType: StatsType;
    amount: number;
};

export type Building = {
    buildingId: number;
    name: string;
    category: BuildingType;
    description: string;
    colorHex: string;
    iconKey: string;
    cost: number;
    shape: BuildingTileType[][];
    baseProduction: Production[];
    incomingSynergies: BuildingSynergy[];
    outgoingSynergies: BuildingSynergy[];
};
