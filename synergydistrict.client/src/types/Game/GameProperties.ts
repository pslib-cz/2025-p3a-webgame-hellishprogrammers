export type GamePropertiesValue = {
    CHUNK_SIZE: number;
    SCALE_BY: number;
    MIN_SCALE: number;
    MAX_SCALE: number;
    TILE_SIZE: number;
    RENDER_DISTANCE_CHUNKS: number;
    MAX_LOADED_CHUNKS: number;
    MAP_SEED: number;
};

export const defaultGameProperties: GamePropertiesValue = {
    CHUNK_SIZE: 64,
    SCALE_BY: 1.15,
    MIN_SCALE: 0.1,
    MAX_SCALE: 5,
    TILE_SIZE: 64,
    RENDER_DISTANCE_CHUNKS: 2,
    MAX_LOADED_CHUNKS: 225,
    MAP_SEED: 12345678,
};
