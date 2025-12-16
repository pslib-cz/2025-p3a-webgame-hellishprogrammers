import { useContext } from "react";
import { SettingsContext } from "../../provider/SettingsProvider";

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within SettingsProvider");
    return context;
};
