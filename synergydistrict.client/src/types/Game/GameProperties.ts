export type GamePropertiesValue = {
    CHUNK_SIZE: number;
    SCALE_BY: number;
    MIN_SCALE: number;
    MAX_SCALE: number;
    TILE_SIZE: number;
    RENDER_DISTANCE_CHUNKS: number;
    MAX_LOADED_CHUNKS: number;
    MAP_SEED: number;
    SCALES: number[];
};

export const defaultGameProperties: GamePropertiesValue = {
    CHUNK_SIZE: 16,
    SCALE_BY: 1.1,
    MIN_SCALE: 0.06,
    MAX_SCALE: 5,
    TILE_SIZE: 128,
    RENDER_DISTANCE_CHUNKS: 2,
    MAX_LOADED_CHUNKS: 225,
    MAP_SEED: 12345678,
    SCALES: [0.25, 0.5, 1, 2, 3, 4, 5],
};
