import {
    createContext,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type FC,
    type PropsWithChildren,
    type SetStateAction,
} from "react";
import { defaultGameVariables, type GameVariablesValue } from "../types/Game/GameVariables";
import useGameProperties from "../hooks/providers/useGameProperties";

type GameVariablesContextValue = {
    variables: GameVariablesValue;
    setVariables: Dispatch<SetStateAction<GameVariablesValue>>;
};

export const GameVariablesContext = createContext<GameVariablesContextValue | null>(null);

export const GameVariablesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [variables, setVariables] = useState<GameVariablesValue>(defaultGameVariables);
    const { TPS } = useGameProperties();
    const elapsedGameTicksRef = useRef(0);

    useEffect(() => {
        const speed = variables.timerSpeed;
        const ticksPerSecond = Math.max(TPS, 1);
        if (speed === "pause") {
            return undefined;
        }

        const tickStep = speed === "fastforward" ? 2 : 1;
        const intervalMs = 1000 / (ticksPerSecond * tickStep);

        const id = window.setInterval(() => {
            elapsedGameTicksRef.current += 1;
            setVariables((prev) => ({ ...prev, timer: elapsedGameTicksRef.current }));
        }, intervalMs);

        return () => window.clearInterval(id);
    }, [variables.timerSpeed, TPS, setVariables]);

    return (
        <GameVariablesContext.Provider value={{ variables, setVariables }}>{children}</GameVariablesContext.Provider>
    );
};
