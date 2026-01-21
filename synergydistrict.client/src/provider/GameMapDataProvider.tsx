import { createContext, useEffect, useState } from "react";
import { defaultGameMapData, type GameMapData } from "../types/Game/GameMapData";
import type { MapBuilding } from "../types/Game/Grid";
import { loadStoredState, saveStoredState } from "../utils/stateStorage";

type GameMapDataContextValue = {
    GameMapData: GameMapData;
    setGameMapData: React.Dispatch<React.SetStateAction<GameMapData>>;
};

export const GameMapDataContext = createContext<GameMapDataContextValue | null>(null);

const rebuildPlacedBuildingsMap = (placedBuildings: MapBuilding[]): Record<string, MapBuilding> => {
    const rebuilt: Record<string, MapBuilding> = {};

    for (const building of placedBuildings) {
        for (let y = 0; y < building.shape.length; y++) {
            const row = building.shape[y];
            for (let x = 0; x < row.length; x++) {
                const tile = row[x];
                if (tile === "Empty") continue;

                const key = `${building.position.x + x};${building.position.y + y}`;
                rebuilt[key] = building;
            }
        }
    }

    return rebuilt;
};

export const GameMapDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [GameMapData, setGameMapData] = useState<GameMapData>(() => {
        const stored = loadStoredState<GameMapData>("gameMapData", defaultGameMapData);
        const sanitizedPlacedBuildings = (stored.placedBuildings ?? []).map((storedBuilding) => ({
            ...storedBuilding,
            isSelected: false,
        }));
        return {
            ...stored,
            placedBuildings: sanitizedPlacedBuildings,
            placedBuildingsMappped: rebuildPlacedBuildingsMap(sanitizedPlacedBuildings),
        };
    });

    useEffect(() => {
        saveStoredState("gameMapData", GameMapData);
    }, [GameMapData]);

    return (
        <GameMapDataContext.Provider value={{ GameMapData, setGameMapData}}>
            {children}
        </GameMapDataContext.Provider>
    );
}