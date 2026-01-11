import { useContext } from "react";
import { GameMapDataContext } from "../../provider/GameMapDataProvider";

const useGameMapData = () => {
    const context = useContext(GameMapDataContext);
    if (!context) throw new Error("useGameMapData must be used within GameMapDataProvider");
    return context;
}

export default useGameMapData;