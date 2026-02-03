import type { BuildingType } from "../Game/Buildings";

export type Statistics = {
    moneyMade: number;
    moneySpend: number;
    buildingsPlaced: number;
    buildingsDemolished: number;
    buildingsUpgraded: number;
    buildingsPlacedByType: Map<BuildingType, number>;
};

export const defaultStatistics: Statistics = {
    moneyMade: 0,
    moneySpend: 0,
    buildingsPlaced: 0,
    buildingsDemolished: 0,
    buildingsUpgraded: 0,
    buildingsPlacedByType: new Map(),
};
