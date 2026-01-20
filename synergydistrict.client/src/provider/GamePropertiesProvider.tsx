import {
    createContext,
    useMemo,
    useState,
    type Dispatch,
    type FC,
    type PropsWithChildren,
    type SetStateAction,
} from "react";
import { defaultGameProperties, type GamePropertiesValue } from "../types/Game/GameProperties";

export type GamePropertiesContextValue = GamePropertiesValue & {
    setGameProperties: Dispatch<SetStateAction<GamePropertiesValue>>;
};

export const GamePropertiesContext = createContext<GamePropertiesContextValue | null>(null);

export const GamePropertiesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [properties, setGameProperties] = useState<GamePropertiesValue>(() => ({ ...defaultGameProperties }));

    const value = useMemo<GamePropertiesContextValue>(
        () => ({ ...properties, setGameProperties }),
        [properties, setGameProperties]
    );

    return <GamePropertiesContext.Provider value={value}>{children}</GamePropertiesContext.Provider>;
};
