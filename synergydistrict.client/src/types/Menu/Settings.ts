export type SettingsProviderValue = {
    gameSettings: Settings;
    setGameSettings: (x: Settings) => void;
};

export type Settings = {
    isMusic: boolean;
    isSound: boolean;
    crtIntensity: number;
    uiScale: number;
};

export const defaultSettings: Settings = {
    isMusic: true,
    isSound: true,
    crtIntensity: 65,
    uiScale: 75,
};
