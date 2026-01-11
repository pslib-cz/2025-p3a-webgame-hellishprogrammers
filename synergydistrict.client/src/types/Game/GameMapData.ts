import type { MapBuilding, MapTile } from "./Grid";

export type GameMapData = {
    loadedChunks: Record<string, MapTile[]>;
    loadedMapTiles: Record<string, MapTile>;
    placedBuildings: MapBuilding[];
    placedBuildingsMappped: Record<string, MapBuilding>;
}

export const defaultGameMapData: GameMapData = {
    loadedChunks: {},
    loadedMapTiles: {},
    placedBuildings: [],
    placedBuildingsMappped: {},
};