export type GamePropertiesValue = {
    CHUNK_SIZE: number;
    SCALE_BY: number;
    MIN_SCALE: number;
    MAX_SCALE: number;
    TILE_SIZE: number;
    RENDER_DISTANCE_CHUNKS: number;
    MAX_LOADED_CHUNKS: number;
    MAP_SEED: number;
    TPS: number;
    SCALES: number[];
};

export const defaultGameProperties: GamePropertiesValue = {
    CHUNK_SIZE: 16,
    SCALE_BY: 1.1,
    MIN_SCALE: 0.4,
    MAX_SCALE: 1.2,
    TILE_SIZE: 64,
    RENDER_DISTANCE_CHUNKS: 2,
    MAX_LOADED_CHUNKS: 255,
    MAP_SEED: 12345678,
    TPS: 4,
    SCALES: [0.25, 0.5, 1, 2, 3, 4, 5],
};
