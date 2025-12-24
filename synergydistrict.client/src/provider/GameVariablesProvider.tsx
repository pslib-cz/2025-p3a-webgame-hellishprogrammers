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

type GameVariablesContextValue = {
    variables: GameVariablesValue;
    setVariables: Dispatch<SetStateAction<GameVariablesValue>>;
};

export const GameVariablesContext = createContext<GameVariablesContextValue | null>(null);

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor(totalSeconds % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
};

export const GameVariablesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [variables, setVariables] = useState<GameVariablesValue>(defaultGameVariables);
    const elapsedSecondsRef = useRef(0);

    useEffect(() => {
        const speed = variables.timerSpeed;
        const intervalMs = speed === "pause" ? null : speed === "fastforward" ? 500 : 1000;
        if (intervalMs === null) return undefined;

        const tickAmount = speed === "fastforward" ? 2 : 1;
        const id = window.setInterval(() => {
            elapsedSecondsRef.current += tickAmount;
            setVariables((prev) => ({ ...prev, timer: formatTime(elapsedSecondsRef.current) }));
        }, intervalMs);

        return () => window.clearInterval(id);
    }, [variables.timerSpeed]);

    return (
        <GameVariablesContext.Provider value={{ variables, setVariables }}>
            {children}
        </GameVariablesContext.Provider>
    );
};
