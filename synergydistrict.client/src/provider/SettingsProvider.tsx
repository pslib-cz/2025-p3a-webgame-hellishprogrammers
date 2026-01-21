import { useEffect, useState, type FC, type PropsWithChildren, createContext } from "react";
import { defaultSettings, type Settings, type SettingsProviderValue } from "../types/Menu/Settings";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";

export const SettingsContext = createContext<SettingsProviderValue | null>(null);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [options, setOptions] = useState<Settings>(() =>
        loadStoredState<Settings>("settings", defaultSettings, "local")
    );

    useEffect(() => {
        saveStoredState("settings", options, "local");
    }, [options]);

    return <SettingsContext.Provider value={{ options, setOptions }}>{children}</SettingsContext.Provider>;
};
