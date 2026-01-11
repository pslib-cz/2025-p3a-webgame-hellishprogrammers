import { createContext, useState } from "react";
import { defaultGameMapData, type GameMapData } from "../types/Game/GameMapData";

type GameMapDataContextValue = {
    GameMapData: GameMapData;
    setGameMapData: React.Dispatch<React.SetStateAction<GameMapData>>;
};

export const GameMapDataContext = createContext<GameMapDataContextValue | null>(null);

export const GameMapDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [GameMapData, setGameMapData] = useState<GameMapData>(defaultGameMapData);

    return (
        <GameMapDataContext.Provider value={{ GameMapData, setGameMapData}}>
            {children}
        </GameMapDataContext.Provider>
    );
}