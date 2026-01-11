import { useContext } from "react";
import { GameTimeContext } from "../../provider/GameTimeProvider";

const useGameTime = () => {
    const context = useContext(GameTimeContext);
    if (!context) throw new Error("useGameTime must be used within GameTimeProvider");
    return context;
}

export default useGameTime;