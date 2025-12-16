import { useState, type FC, type PropsWithChildren, createContext } from "react";
import { defaultSettings, type Settings, type SettingsProviderValue } from "../types/Menu/Settings";

export const SettingsContext = createContext<SettingsProviderValue | null>(null);

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [options, setOptions] = useState<Settings>(defaultSettings);

    return <SettingsContext.Provider value={{ options, setOptions }}>{children}</SettingsContext.Provider>;
};
