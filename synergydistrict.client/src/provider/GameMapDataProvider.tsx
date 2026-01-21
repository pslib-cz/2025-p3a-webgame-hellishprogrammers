import { createContext, useEffect, useState } from "react";
import { defaultGameMapData, type GameMapData } from "../types/Game/GameMapData";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";

type GameMapDataContextValue = {
    GameMapData: GameMapData;
    setGameMapData: React.Dispatch<React.SetStateAction<GameMapData>>;
};

export const GameMapDataContext = createContext<GameMapDataContextValue | null>(null);

export const GameMapDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [GameMapData, setGameMapData] = useState<GameMapData>(() =>
        loadStoredState<GameMapData>("gameMapData", defaultGameMapData)
    );

    useEffect(() => {
        saveStoredState("gameMapData", GameMapData);
    }, [GameMapData]);

    return (
        <GameMapDataContext.Provider value={{ GameMapData, setGameMapData}}>
            {children}
        </GameMapDataContext.Provider>
    );
}