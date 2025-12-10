export type BuildingType = "Residential" | "Commercial" | "Industrial" | "Extractional" | "Recreational";
export type BuildingTileType = "Solid" | "Empty" | "Icon";
export type ResourceType = "Money" | "People" | "Energy" | "Happiness" | "Industry";

export type BuildingPreview = {
    buildingId: number;
    name: string;
    type: BuildingType;
    colorHex: string;
    iconKey: string;
    shape: BuildingTileType[][];
}

export type SynergyBuilding ={
    buildingId: number;
    name: string;
    type: BuildingType;
    colorHex: string;
}

export type BuildingSynergy = {
    sourceBuildingId: SynergyBuilding;
    targetBuildingId: SynergyBuilding;
    productionBonuses: Production[];
}

export type Production = {
    resourceType: ResourceType;
    amount: number;
}

export type BuildingDetail = {
    buildingId: number;
    name: string;
    type: string;
    description: string;
    colorHex: string;
    iconKey: string;
    cost: number;
    shape: BuildingTileType[][];
    baseProduction: Production;
    incomingSynergies: BuildingSynergy[];
    outgoingSynergies: BuildingSynergy[];
}