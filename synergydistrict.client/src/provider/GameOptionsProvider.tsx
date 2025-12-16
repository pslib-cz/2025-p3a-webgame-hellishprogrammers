import { useState, type FC, type PropsWithChildren, createContext } from "react";
import { defaultGameOptions, type GameOptions } from "../types/Menu/GameOptions";

type GameOptionsContextValue = {
  options: GameOptions;
  setOptions: (x: GameOptions) => void;
};

export const GameOptionsContext = createContext<GameOptionsContextValue | null>(null);

export const GameOptionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [options, setOptions] = useState<GameOptions>(defaultGameOptions);

  return <GameOptionsContext.Provider value={{ options, setOptions }}>{children}</GameOptionsContext.Provider>;
};
