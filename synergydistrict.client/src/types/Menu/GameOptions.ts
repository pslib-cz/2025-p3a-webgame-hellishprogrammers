type GameMode = "timePresure" | "survival";

export type GameOptions = {
    gameMode: GameMode;
    gameDuration: number;
    infiniteMap: boolean;
    mapSize?: number;
};

export const defaultGameOptions: GameOptions = {
    gameMode: "timePresure",
    gameDuration: 10,
    infiniteMap: true,
};
