import type { BuildingSynergy } from "./Buildings";
import type { ActiveSynergies, MapBuilding, MapTile, NaturalFeature } from "./Grid";

export type GameMapData = {
    loadedChunks: Record<string, MapTile[]>;
    loadedMapTiles: Record<string, MapTile>;
    activeSynergies: ActiveSynergies[];
    placedBuildings: MapBuilding[];
    placedBuildingsMappped: Record<string, MapBuilding>;
    ActiveNaturalFeatures?: Record<string, NaturalFeature>;
    activeSynergyUpgrades?: Record<string, BuildingSynergy[]>;
};

export const defaultGameMapData: GameMapData = {
    loadedChunks: {},
    loadedMapTiles: {},
    activeSynergies: [],
    placedBuildings: [],
    placedBuildingsMappped: {},
    activeSynergyUpgrades: {},
};
