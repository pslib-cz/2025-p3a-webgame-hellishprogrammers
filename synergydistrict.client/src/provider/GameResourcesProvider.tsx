import { createContext, useEffect, useState } from "react";
import { defaultGameResources, type GameResources } from "../types/Game/GameResources";
import useGameTime from "../hooks/providers/useGameTime";
import useGameProperties from "../hooks/providers/useGameProperties";

type GameResourcesContextValue = {
    GameResources: GameResources;
    setGameResources: React.Dispatch<React.SetStateAction<GameResources>>;
};

export const GameResourcesContext = createContext<GameResourcesContextValue | null>(null);

export const GameResourcesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [GameResources, setGameResources] = useState<GameResources>(defaultGameResources);
    const {time} = useGameTime();
    const {TPS} = useGameProperties();

    useEffect(() => {
        if (TPS === 0) return; // avoid division by zero
        if (time.timer === 0) return;
        if (time.timer % TPS !== 0) return;

        setGameResources(prev => ({
            ...prev,
            moneyBalance: prev.moneyBalance + prev.money,
        }));
    }, [time.timer, TPS]);

    return (
        <GameResourcesContext.Provider value={{ GameResources, setGameResources}}>
            {children}
        </GameResourcesContext.Provider>
    );
}