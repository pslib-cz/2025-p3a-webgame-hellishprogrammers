export type SettingsProviderValue = {
    gameSettings: Settings;
    setGameSettings: (x: Settings) => void;
};

export type Settings = {
    isMusic: boolean;
    crtIntensity: number; // 0-100, 0 = off
};

export const defaultSettings: Settings = {
    isMusic: true,
    crtIntensity: 65,
};
