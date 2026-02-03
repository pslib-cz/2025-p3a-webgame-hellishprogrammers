import type { BuildingType } from "../Game/Buildings";

export type History = {
    moneyMade: number;
    moneySpend: number;
    buildingsPlaced: number;
    buildingsDemolished: number;
    buildingsUpgraded: number;
    buildingsPlacedByType: Map<BuildingType, number>;
};
