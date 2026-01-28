export type SettingsProviderValue = {
    gameSettings: Settings;
    setGameSettings: (x: Settings) => void;
};

export type Settings = {
    isMusic: boolean;
    crtIntensity: number; 
    uiScale: number; 
};

export const defaultSettings: Settings = {
    isMusic: true,
    crtIntensity: 65,
    uiScale: 100,
};
