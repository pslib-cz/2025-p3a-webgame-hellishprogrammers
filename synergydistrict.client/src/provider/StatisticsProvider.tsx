import { createContext, useEffect, useState } from "react";
import { defaultStatistics, type Statistics } from "../types/Menu/Statistics";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";

type StatisticsProviderValue = {
    statistics: Statistics;
    setStatistics: React.Dispatch<React.SetStateAction<Statistics>>;
};

export const StatisticsContext = createContext<StatisticsProviderValue | null>(null);

export const StatisticsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [statistics, setStatistics] = useState<Statistics>(() =>
        loadStoredState<Statistics>("statistics", defaultStatistics, "local"),
    );

    useEffect(() => {
        saveStoredState("statistics", statistics, "local");
    }, [statistics]);

    return <StatisticsContext.Provider value={{ statistics, setStatistics }}>{children}</StatisticsContext.Provider>;
};
