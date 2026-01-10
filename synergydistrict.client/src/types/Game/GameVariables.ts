import type { TimerSpeedType } from "..";
import type { MapBuilding, MapTile } from "./Grid";

export type GameVariablesValue = {
    moneyBalance: number;
    money: number;
    peopleUsed: number;
    people: number;
    energyUsed: number;
    energy: number;
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
    moneyBalance: 750,
    money: 0,
    peopleUsed: 0,
    people: 0,
    energyUsed: 0,
    energy: 0,
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
