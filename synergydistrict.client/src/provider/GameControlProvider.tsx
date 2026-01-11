import { createContext, useState } from "react";
import { defaultGameControl, type GameControl } from "../types/Game/GameControl";

type GameControlContextValue = {
    gameControl: GameControl;
    setGameControl: React.Dispatch<React.SetStateAction<GameControl>>;
};

export const GameControlContext = createContext<GameControlContextValue | null>(null);

export const GameControlProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [gameControl, setGameControl] = useState<GameControl>(defaultGameControl);

    return (
        <GameControlContext.Provider value={{ gameControl, setGameControl}}>
            {children}
        </GameControlContext.Provider>
    );
}