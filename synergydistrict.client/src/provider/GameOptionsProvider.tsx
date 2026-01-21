import { useState, useCallback, type FC, type PropsWithChildren, createContext } from "react";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";
import { defaultGameOptions, type GameOptions } from "../types/Menu/GameOptions";

type GameOptionsContextValue = {
  options: GameOptions;
  setOptions: (x: GameOptions) => void;
};

export const GameOptionsContext = createContext<GameOptionsContextValue | null>(null);

export const GameOptionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [options, setOptionsState] = useState<GameOptions>(() => {
    if (typeof window === "undefined") {
      return defaultGameOptions;
    }

    const storedOptions = loadStoredState<GameOptions>("gameOptions", defaultGameOptions);

    const storage = window.sessionStorage;
    if (!storage.getItem("gameOptions")) {
      saveStoredState("gameOptions", storedOptions);
    }

    return storedOptions;
  });

  const setOptions = useCallback((value: GameOptions) => {
    setOptionsState(value);

    if (typeof window === "undefined") {
      return;
    }

    saveStoredState("gameOptions", value);
  }, []);

  return <GameOptionsContext.Provider value={{ options, setOptions }}>{children}</GameOptionsContext.Provider>;
};
