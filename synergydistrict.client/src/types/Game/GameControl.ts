import type { TimerSpeedType } from "..";

export type GameControl = {
    timerSpeed: TimerSpeedType;
    isSound: boolean;
    isEnd: boolean;
};

export const defaultGameControl: GameControl = {
    timerSpeed: "pause",
    isSound: true,
    isEnd: false,
};
