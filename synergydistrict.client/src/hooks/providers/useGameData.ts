import { useContext } from "react";
import { GameDataContext } from "../../provider/GameDataProvider";

export const useGameData = () => {
    const context = useContext(GameDataContext);
    if (!context) throw new Error("useGameData must be used within GameDataProvider");
    return context;
};
