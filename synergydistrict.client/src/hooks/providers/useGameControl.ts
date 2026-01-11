import { useContext } from "react";
import { GameControlContext } from "../../provider/GameControlProvider";

const useGameControl = () => {
    const context = useContext(GameControlContext);
    if (!context) throw new Error("useGameControl must be used within GameControlProvider");
    return context;
}

export default useGameControl;