import { useContext } from "react";
import { PlacedBuildingsContext, type PlacedBuildingsContextType } from "../../provider/PlacedBuildingsProvider";

export function usePlacedBuildings(): PlacedBuildingsContextType {
    const context = useContext(PlacedBuildingsContext);
    if (!context) {
        throw new Error("usePlacedBuildings must be used within PlacedBuildingsProvider");
    }
    return context;
}
