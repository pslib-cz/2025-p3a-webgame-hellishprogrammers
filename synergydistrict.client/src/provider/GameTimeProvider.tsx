import { createContext, useEffect, useRef, useState, type PropsWithChildren } from "react";
import { defaultGameTime, type GameTimeType } from "../types/Game/GameTime";
import useGameProperties from "../hooks/providers/useGameProperties";
import useGameControl from "../hooks/providers/useGameControl";
import { useGameOptions } from "../hooks/providers/useGameOptions";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";

type GameTimeContextValue = {
    time: GameTimeType;
    setTime: React.Dispatch<React.SetStateAction<GameTimeType>>;
    registerPaymentCallback?: (callback: (payment: number) => void) => void;
};

export const GameTimeContext = createContext<GameTimeContextValue | null>(null);

export const GameTimeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { gameControl, setGameControl } = useGameControl();
    const { options } = useGameOptions();
    const [time, setTime] = useState<GameTimeType>(() =>
        loadStoredState<GameTimeType>("gameTime", defaultGameTime)
    );
    const { TPS } = useGameProperties();
    const elapsedGameTicksRef = useRef(0);
    const [paymentCallback, setPaymentCallback] = useState<((payment: number) => void) | undefined>(undefined);

    useEffect(() => {
        elapsedGameTicksRef.current = time.timer;
    }, [time.timer]);

    useEffect(() => {
        saveStoredState("gameTime", time);
    }, [time]);

    // Time Pressure mode end condition
    useEffect(() => {
        if (options.gameMode === "timePresure" && !gameControl.isEnd && options.gameDuration * 60 - time.timer / TPS <= 0) {
            setGameControl((prev) => ({
                ...prev,
                isEnd: true,
            }));
        }
    }, [time.timer, options.gameMode]);

    useEffect(() => {
        if (options.gameMode === "survival" && !gameControl.isEnd) {
            const QUARTER_DURATION_SECONDS = options.gameDuration;
            const quarterTime = Math.floor(time.timer / TPS) % QUARTER_DURATION_SECONDS;
            const currentQuarter = Math.floor(time.timer / (TPS * QUARTER_DURATION_SECONDS)) + 1;
            
            if (quarterTime === 0 && time.timer > 0 && currentQuarter !== time.currentQuarter) {
                setTime((prev) => ({
                    ...prev,
                    currentQuarter: currentQuarter,
                }));
                
                if (paymentCallback) {
                    const basePayment = 1000;
                    const payment = Math.floor(basePayment * Math.pow(1.5, currentQuarter - 1));
                    paymentCallback(payment);
                }
            }
            
            const basePayment = 1000;
            const nextPayment = Math.floor(basePayment * Math.pow(1.5, currentQuarter - 1));
            
            if (nextPayment !== time.nextPayment) {
                setTime((prev) => ({
                    ...prev,
                    nextPayment: nextPayment,
                }));
            }
        }
    }, [time.timer, TPS, options.gameMode, paymentCallback, gameControl.isEnd]);

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

    return <GameTimeContext.Provider value={{ 
        time, 
        setTime,
        registerPaymentCallback: (callback: (payment: number) => void) => setPaymentCallback(() => callback)
    }}>{children}</GameTimeContext.Provider>;
};
