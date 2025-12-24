import { useContext } from "react";
import { GameVariablesContext } from "../../provider/GameVariablesProvider";

const useGameVariables = () => {
    const context = useContext(GameVariablesContext);
    if (!context) throw new Error("useGameVariables must be used within GameVariablesProvider");
    return context;
};

export default useGameVariables;
