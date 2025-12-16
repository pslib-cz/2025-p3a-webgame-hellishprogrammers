export type SettingsProviderValue = {
    options: Settings;
    setOptions: (x: Settings) => void;
};

export type Settings = {
    isMusic: boolean;
};

export const defaultSettings: Settings = {
    isMusic: true,
};
