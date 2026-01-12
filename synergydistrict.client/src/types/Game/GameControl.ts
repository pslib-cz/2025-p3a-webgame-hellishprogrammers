import type { TimerSpeedType } from "..";

export type GameControl = {
  timerSpeed: TimerSpeedType;
  isSound: boolean;
};

export const defaultGameControl: GameControl = {
  timerSpeed: "play",
  isSound: true,
};
