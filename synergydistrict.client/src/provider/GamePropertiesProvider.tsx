import { createContext, type FC, type PropsWithChildren } from "react";
import { defaultGameProperties, type GamePropertiesValue } from "../types/Game/GameProperties";

export const GamePropertiesContext = createContext<GamePropertiesValue | null>(null);

export const GamePropertiesProvider: FC<PropsWithChildren> = ({ children }) => {
    return <GamePropertiesContext.Provider value={defaultGameProperties}>{children}</GamePropertiesContext.Provider>;
};
