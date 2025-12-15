import { useContext } from "react";
import { gamePropertiesContext } from "../provider/GamePropertiesProvider";

const useGameProperties = () => {
    const context = useContext(gamePropertiesContext);
    if (!context) throw new Error("useGameProperties must be used within GamePropertiesProvider");
    return context;
};

export default useGameProperties;
