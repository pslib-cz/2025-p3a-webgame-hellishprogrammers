import { createContext, useEffect, useRef, useState, type PropsWithChildren } from "react";
import { defaultGameTime, type GameTimeType } from "../types/Game/GameTime";
import useGameProperties from "../hooks/providers/useGameProperties";
import useGameControl from "../hooks/providers/useGameControl";

type GameTimeContextValue = {
    time: GameTimeType;
    setTime: React.Dispatch<React.SetStateAction<GameTimeType>>;
};

export const GameTimeContext = createContext<GameTimeContextValue | null>(null);

export const GameTimeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { gameControl } = useGameControl();
    const [time, setTime] = useState<GameTimeType>(defaultGameTime);
    const { TPS } = useGameProperties();
    const elapsedGameTicksRef = useRef(0);

    useEffect(() => {
        const speed = gameControl.timerSpeed;
        const ticksPerSecond = Math.max(TPS, 1);
        if (speed === "pause") {
            return undefined;
        }

        const tickStep = speed === "fastforward" ? 2 : 1;
        const intervalMs = 1000 / (ticksPerSecond * tickStep);

        const id = window.setInterval(() => {
            elapsedGameTicksRef.current += 1;
            setTime((prev) => ({
                ...prev,
                timer: elapsedGameTicksRef.current,
            }));
        }, intervalMs);

        return () => window.clearInterval(id);
    }, [gameControl.timerSpeed, TPS]);

    return (
        <GameTimeContext.Provider value={{ time, setTime }}>{children}</GameTimeContext.Provider>
    );
};
