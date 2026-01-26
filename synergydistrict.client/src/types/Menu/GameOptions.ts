type GameMode = "timePresure" | "survival";

export type GameOptions = {
  gameMode: GameMode;
  gameDuration: number;
  infiniteMap: boolean;
  mapSize?: number;
  seed: number;
};

export const defaultGameOptions: GameOptions = {
  gameMode: "timePresure",
  gameDuration: 10,
  infiniteMap: false,
  seed: Math.floor(Math.random() * 1000000)
};
