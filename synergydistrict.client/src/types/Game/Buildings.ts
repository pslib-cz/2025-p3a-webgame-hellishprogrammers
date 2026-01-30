import type { BuildingTileType, BuildingCategory, StatsType } from "..";
import type { EdgeSide, Position } from "./Grid";

export type BuildingSynergy = {
    sourceBuildingId: number;
    targetBuildingId: number;
    synergyProductions: Production[];
};

export type Production = {
    type: StatsType;
    value: number;
};

export type ProductionProjection = {
    production: Production
    detlaValue: number
}

export type SynergyProjection = {
    sourceBuildingId: number;
    targetBuildingId: number;
    productionProjection: ProductionProjection[]
}

export type Edge = {
    position: Position;
    side: EdgeSide;
};

export type BuildingUpgrades = {
    upgradeCost: number;
    deleteCost: number;
    upgradeProductions: Production[];
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
    upgrades: BuildingUpgrades[];
    edges: Edge[];
};
