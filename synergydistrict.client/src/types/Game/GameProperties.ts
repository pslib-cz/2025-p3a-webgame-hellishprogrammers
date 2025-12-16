export type GamePropertiesValue = {
    CHUNK_SIZE: number;
    SCALE_BY: number;
    MIN_SCALE: number;
    MAX_SCALE: number;
    TILE_SIZE: number;
};

export const defaultGameProperties: GamePropertiesValue = {
    CHUNK_SIZE: 16,
    SCALE_BY: 1.15,
    MIN_SCALE: 0.01,
    MAX_SCALE: 5,
    TILE_SIZE: 64,
};
