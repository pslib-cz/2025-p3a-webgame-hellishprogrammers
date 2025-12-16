import { useContext } from "react";
import { GameOptionsContext } from "../../provider/GameOptionsProvider";

export const useGameOptions = () => {
  const context = useContext(GameOptionsContext);
  if (!context) throw new Error("useGameOptions must be used within GameOptionsProvider");
  return context;
};
