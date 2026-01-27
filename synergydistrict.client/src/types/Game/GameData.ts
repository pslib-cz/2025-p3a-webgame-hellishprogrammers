import type { BuildingType, BuildingSynergy } from "./Buildings";

export type GameData = {
    buildings: BuildingType[];
    naturalFeatures: { SynergyItemId: number; Name: string }[];
    synergies: BuildingSynergy[];
};
