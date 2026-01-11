import type { TimerSpeedType } from "..";

export type GameControl = {
    timerSpeed: TimerSpeedType;
    isSound: boolean;
    isEnd: boolean;
};

export const defaultGameControl: GameControl = {
    timerSpeed: "play",
    isSound: true,
    isEnd: false,
};
