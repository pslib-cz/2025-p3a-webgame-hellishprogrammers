import { useContext } from "react";
import { BuildingsBitmapContext } from "../../provider/BuildingsBitmapProvider";

export const useBuildingsBitmap = () => {
    const context = useContext(BuildingsBitmapContext);
    if (!context) throw new Error("useBuildingsBitmap must be used within GameDataProvider");
    return context;
};
