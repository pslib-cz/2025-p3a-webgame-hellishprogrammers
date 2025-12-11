export type GameOptions = {
  duration: number;
  mapSize: number;
  soundEnabled: boolean;
};

export const defaultGameOptions: GameOptions = {
  duration: 10,
  mapSize: 100,
  soundEnabled: true,
};
