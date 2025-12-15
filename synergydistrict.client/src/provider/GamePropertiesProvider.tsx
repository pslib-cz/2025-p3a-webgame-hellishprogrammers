import { createContext, type ReactNode } from "react";

type gamePropertiesValue = {
    CHUNK_SIZE: number;
    SCALE_BY: number;
    MIN_SCALE: number;
    MAX_SCALE: number;
    TILE_SIZE: number;
};

const defaultGameProperties: gamePropertiesValue = {
    CHUNK_SIZE: 128,
    SCALE_BY: 1.15,
    MIN_SCALE: 0.01,
    MAX_SCALE: 5,
    TILE_SIZE: 64,
};

export const gamePropertiesContext = createContext<gamePropertiesValue>(defaultGameProperties);

export const GamePropertiesProvider = ({ children }: { children: ReactNode }) => {
    return <gamePropertiesContext.Provider value={defaultGameProperties}>{children}</gamePropertiesContext.Provider>;
};
