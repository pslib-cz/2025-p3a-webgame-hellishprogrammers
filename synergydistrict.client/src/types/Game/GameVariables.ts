import type { TimerSpeedType } from "..";
import type { MapBuilding, MapTile } from "./Grid";

export type GameVariablesValue = {
    moneyCurrent: number;
    moneyPerTick: number;
    peopleCurrent: number;
    peopleMax: number;
    energyCurrent: number;
    energyMax: number;
    industry: number;
    happiness: number;
    timer: number;
    timerSpeed: TimerSpeedType;
    isSound: boolean;
    loadedChunks: Record<string, MapTile[]>;
    loadedMapTiles: Record<string, MapTile>;
    placedBuildings: MapBuilding[];
    placedBuildingsMappped: Record<string, MapBuilding>;
};

export const defaultGameVariables: GameVariablesValue = {
    moneyCurrent: 0,
    moneyPerTick: 0,
    peopleCurrent: 0,
    peopleMax: 0,
    energyCurrent: 0,
    energyMax: 0,
    industry: 0,
    happiness: 0,
    timer: 0,
    timerSpeed: "play",
    isSound: true,
    loadedChunks: {},
    loadedMapTiles: {},
    placedBuildings: [],
    placedBuildingsMappped: {},
};
