import { createContext, useState, type Dispatch, type FC, type PropsWithChildren, type SetStateAction } from "react";
import type { MapBuilding, Position } from "../types/Game/Grid";
import type { BuildingType } from "../types/Game/Buildings";

export type PlacedBuildingsContextType = {
    placedBuildings: MapBuilding[];
    setPlacedBuildings: Dispatch<SetStateAction<MapBuilding[]>>;
    placeBuilding: (building: BuildingType, position: Position, rotation: number) => void;
    removeBuilding: (buildingInstanceId: string) => void;
    selectBuilding: (buildingInstanceId: string | null) => void;
    getSelectedBuilding: () => MapBuilding | null;
};

export const PlacedBuildingsContext = createContext<PlacedBuildingsContextType | null>(null);

let buildingCounter = 0;

export const PlacedBuildingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [placedBuildings, setPlacedBuildings] = useState<MapBuilding[]>([]);

    const placeBuilding = (building: BuildingType, position: Position, rotation: number) => {
        const newBuilding: MapBuilding = {
            building,
            position,
            rotation: rotation % 4,
            edges: [],
            isSelected: false,
            buildingInstanceId: `${building.buildingId}-${buildingCounter++}`,
        };

        setPlacedBuildings((prev) => [...prev, newBuilding]);
    };

    const removeBuilding = (buildingInstanceId: string) => {
        setPlacedBuildings((prev) => prev.filter((b) => b.buildingInstanceId !== buildingInstanceId));
    };

    const selectBuilding = (buildingInstanceId: string | null) => {
        setPlacedBuildings((prev) =>
            prev.map((b) => ({
                ...b,
                isSelected: b.buildingInstanceId === buildingInstanceId,
            }))
        );
    };

    const getSelectedBuilding = () => {
        return placedBuildings.find((b) => b.isSelected) ?? null;
    };

    return (
        <PlacedBuildingsContext.Provider
            value={{
                placedBuildings,
                setPlacedBuildings,
                placeBuilding,
                removeBuilding,
                selectBuilding,
                getSelectedBuilding,
            }}
        >
            {children}
        </PlacedBuildingsContext.Provider>
    );
};
