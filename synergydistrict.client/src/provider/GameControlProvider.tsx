import { createContext, useEffect, useState } from "react";
import { defaultGameControl, type GameControl } from "../types/Game/GameControl";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";

type GameControlContextValue = {
    gameControl: GameControl;
    setGameControl: React.Dispatch<React.SetStateAction<GameControl>>;
};

export const GameControlContext = createContext<GameControlContextValue | null>(null);

export const GameControlProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [gameControl, setGameControl] = useState<GameControl>(() =>
        loadStoredState<GameControl>("gameControl", defaultGameControl)
    );

    useEffect(() => {
        saveStoredState("gameControl", gameControl);
    }, [gameControl]);

    return (
        <GameControlContext.Provider value={{ gameControl, setGameControl}}>
            {children}
        </GameControlContext.Provider>
    );
}