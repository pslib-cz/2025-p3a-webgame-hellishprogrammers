import { useState, useCallback, type FC, type PropsWithChildren, createContext } from "react";
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

    const storedValue = sessionStorage.getItem("gameOptions");
    if (!storedValue) {
      return defaultGameOptions;
    }

    try {
      const parsedValue = JSON.parse(storedValue) as GameOptions;
      return { ...defaultGameOptions, ...parsedValue };
    } catch (error) {
      console.warn("Failed to parse stored game options", error);
      return defaultGameOptions;
    }
  });

  const setOptions = useCallback((value: GameOptions) => {
    setOptionsState(value);

    if (typeof window === "undefined") {
      return;
    }

    sessionStorage.setItem("gameOptions", JSON.stringify(value));
  }, []);

  return <GameOptionsContext.Provider value={{ options, setOptions }}>{children}</GameOptionsContext.Provider>;
};
