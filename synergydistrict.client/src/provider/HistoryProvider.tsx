import { createContext, useEffect, useState } from "react";
import { type History } from "../types/Menu/History";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";

type HistoryProviderValue = {
    history: History[];
    setHistory: React.Dispatch<React.SetStateAction<History[]>>;
};

export const HistoryContext = createContext<HistoryProviderValue | null>(null);

export const HistoryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [history, setHistory] = useState<History[]>(() => loadStoredState<History[]>("history", [], "local"));

    useEffect(() => {
        saveStoredState("history", history, "local");
    }, [history]);

    return <HistoryContext.Provider value={{ history, setHistory }}>{children}</HistoryContext.Provider>;
};
