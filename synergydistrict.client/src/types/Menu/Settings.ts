export type SettingsProviderValue = {
    gameSettings: Settings;
    setGameSettings: (x: Settings) => void;
};

export type Settings = {
    isMusic: boolean;
};

export const defaultSettings: Settings = {
    isMusic: true,
};
