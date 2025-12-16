import { useContext } from "react";
import { GamePropertiesContext } from "../../provider/GamePropertiesProvider";

const useGameProperties = () => {
    const context = useContext(GamePropertiesContext);
    if (!context) throw new Error("useGameProperties must be used within GamePropertiesProvider");
    return context;
};

export default useGameProperties;
