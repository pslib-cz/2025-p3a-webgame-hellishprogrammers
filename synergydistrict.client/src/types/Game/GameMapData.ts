import type { ActiveSynergies, MapBuilding, MapTile } from "./Grid";

export type GameMapData = {
    loadedChunks: Record<string, MapTile[]>;
    loadedMapTiles: Record<string, MapTile>;
    activeSynergies: ActiveSynergies[];
    placedBuildings: MapBuilding[];
    placedBuildingsMappped: Record<string, MapBuilding>;
};

export const defaultGameMapData: GameMapData = {
    loadedChunks: {},
    loadedMapTiles: {},
    activeSynergies: [],
    placedBuildings: [],
    placedBuildingsMappped: {},
};
