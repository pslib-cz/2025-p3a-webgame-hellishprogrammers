import { useContext } from "react";
import { GameResourcesContext } from "../../provider/GameResourcesProvider";

const useGameResources = () => {
    const context = useContext(GameResourcesContext);
    if (!context) throw new Error("useGameResources must be used within GameResourcesProvider");
    return context;
}

export default useGameResources;