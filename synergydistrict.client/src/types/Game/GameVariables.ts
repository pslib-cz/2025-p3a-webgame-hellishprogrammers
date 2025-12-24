import type { TimerSpeedType } from "..";

export type GameVariablesValue = {
    moneyCurrent: number;
    moneyPerTick: number;
    peopleCurrent: number;
    peopleMax: number;
    energyCurrent: number;
    energyMax: number;
    industry: number;
    happiness: number;
    timer: string;
    timerSpeed: TimerSpeedType;
    isSound: boolean;
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
    timer: "00:00",
    timerSpeed: "play",
    isSound: true,
};
