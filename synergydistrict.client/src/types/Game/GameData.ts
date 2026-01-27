import type { BuildingType, BuildingSynergy } from "./Buildings";

export type GameData = {
    buildings: BuildingType[];
    naturalFeatures: { synergyItemId: number; name: string }[];
    synergies: BuildingSynergy[];
};
