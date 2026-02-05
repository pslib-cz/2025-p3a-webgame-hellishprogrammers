import { createContext, useEffect, useState, useRef } from "react";
import { defaultGameResources, type GameResources } from "../types/Game/GameResources";
import useGameTime from "../hooks/providers/useGameTime";
import useGameProperties from "../hooks/providers/useGameProperties";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";
import { useStatistics } from "../hooks/providers/useStatistics";
import useGameControl from "../hooks/providers/useGameControl";
import { useGameOptions } from "../hooks/providers/useGameOptions";

type GameResourcesContextValue = {
    GameResources: GameResources;
    setGameResources: React.Dispatch<React.SetStateAction<GameResources>>;
};

export const GameResourcesContext = createContext<GameResourcesContextValue | null>(null);

export const GameResourcesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [GameResources, setGameResources] = useState<GameResources>(() =>
        loadStoredState<GameResources>("gameResources", defaultGameResources),
    );
    const { time, registerPaymentCallback } = useGameTime();
    const { TPS } = useGameProperties();
    const { setStatistics } = useStatistics();
    const { setGameControl } = useGameControl();
    const { options } = useGameOptions();
    const callbackRegistered = useRef(false);

    useEffect(() => {
        saveStoredState("gameResources", GameResources);
    }, [GameResources]);

    useEffect(() => {
        if (options.gameMode === "survival" && registerPaymentCallback && !callbackRegistered.current) {
            callbackRegistered.current = true;
            registerPaymentCallback((payment: number) => {
                setGameResources((prev) => {
                    const newBalance = prev.moneyBalance - payment;
                    
                    if (newBalance < 0) {
                        setGameControl((control) => ({
                            ...control,
                            isEnd: true,
                        }));
                        return prev;
                    }
                    
                    return {
                        ...prev,
                        moneyBalance: newBalance,
                    };
                });
            });
        }
    }, [options.gameMode, registerPaymentCallback, setGameControl]);

    useEffect(() => {
        if (TPS === 0) return; // avoid division by zero
        if (time.timer === 0) return;
        if (time.timer % TPS !== 0) return;

        setGameResources((prev) => ({
            ...prev,
            moneyBalance: prev.moneyBalance + prev.money,
        }));

        setStatistics((prev) => ({
            ...prev,
            moneyMade: prev.moneyMade + GameResources.money,
            timeSpendPlaying: prev.timeSpendPlaying + TPS,
        }));
    }, [time.timer, TPS]);

    return (
        <GameResourcesContext.Provider value={{ GameResources, setGameResources }}>
            {children}
        </GameResourcesContext.Provider>
    );
};
