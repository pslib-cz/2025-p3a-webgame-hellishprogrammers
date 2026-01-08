import { createContext, type FC, type PropsWithChildren, useEffect, useState } from "react";
import { useGameData } from "../hooks/providers/useGameData";
import useGameProperties from "../hooks/providers/useGameProperties";
import useFont from "../hooks/useFont";
import { rotateShape } from "../utils/PlacingUtils";
import { createBuildingBitmap } from "../components/Game/Rendering/Shapes/BuildingShape";

type BuildingsBitmapContextValue = {
    buildingsBitmap: Record<number, ImageBitmap[]>;
};


export const BuildingsBitmapContext = createContext<BuildingsBitmapContextValue | null>(null);

export const BuildingsBitmapProvider: FC<PropsWithChildren> = ({ children }) => {
    const [buildingsBitmap, setBuildingsBitmap] = useState<Record<number, ImageBitmap[]>>([]);
    const { buildings } = useGameData();
    const { TILE_SIZE } = useGameProperties();

    const isFontLoaded = useFont("16px icons");

    useEffect(() => {
        if (!buildings || buildings.length === 0 || !isFontLoaded) return;

        const newBitmaps: Record<number, ImageBitmap[]> = {};

        buildings.forEach((building) => {
            newBitmaps[building.buildingId] = [];
            for (let rotation = 0; rotation < 4; rotation++) {
                const shape = rotateShape(building.shape, rotation);
                const canvas: OffscreenCanvas = new OffscreenCanvas(shape[0].length * TILE_SIZE, shape.length * TILE_SIZE);
                const context = canvas.getContext("2d");
                if (!context) {
                    return;
                }
                const bitmap = createBuildingBitmap(shape, building.type, building.iconKey, TILE_SIZE);
                newBitmaps[building.buildingId][rotation] = bitmap!;
            }
        })
        setBuildingsBitmap(newBitmaps);

    }, [buildings, TILE_SIZE, isFontLoaded]);

return <BuildingsBitmapContext.Provider value={{ buildingsBitmap }}>{children}</BuildingsBitmapContext.Provider>;
};
