import { useState } from "react";
import styles from "../styles/Game.module.css";
import GameCanvas from "../components/Game/KonvaNew/GameCanvas";
import GameBar from "./Game/GameBar/GameBar";
import { BuildingsBitmapProvider } from "../provider/BuildingsBitmapProvider";
import { useGameOptions } from "../hooks/providers/useGameOptions";
import type { MapBuilding, Position } from "../types/Game/Grid";
import { useGameData } from "../hooks/providers/useGameData";
import { CanPlaceBuilding, createEgdesForShape } from "../utils/PlacingUtils";
import useGameVariables from "../hooks/providers/useGameVariables";

const Game = () => {
    const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
    const [buildingPreview, setBuildingPreview] = useState<MapBuilding | null>(null);
    const { options } = useGameOptions();
    const { buildings } = useGameData();
    const { variables, setVariables } = useGameVariables();

    const OnMapClick = (position: Position) => {

        if (selectedBuilding === null) return;

        if (CanPlaceBuilding(buildingPreview!.shape, position, variables.placedBuildingsMappped, variables.loadedMapTiles)) {
            console.log("Placing building at:", position);
            const newBuilding: MapBuilding = {
                building: buildings[selectedBuilding - 1],
                MapBuildingId: crypto.randomUUID(),
                position: position,
                edges: buildingPreview!.edges,
                rotation: buildingPreview!.rotation,
                shape: buildingPreview!.shape,
                isSelected: false,
            };

            setVariables({
                ...variables,
                placedBuildings: [...variables.placedBuildings, newBuilding],
                placedBuildingsMappped: { ...variables.placedBuildingsMappped, 
                    ...Object.fromEntries(newBuilding.shape.map((row, y) => 
                        row.map((tile, x) => 
                            tile !== "Empty" ? [`${newBuilding.position.x + x};${newBuilding.position.y + y}`, newBuilding] : null
                        ).filter((entry): entry is [string, MapBuilding] => entry !== null)
                    ).flat())
                 },
            });
        }
    }

    const OnPlaceSelect = (buildingId: number | null) => {
        setSelectedBuilding(buildingId);

        if (buildingId === null) {
            setBuildingPreview(null);
            return;
        }

        const shape = buildings[buildingId - 1].shape;
        const edges = createEgdesForShape(shape);

        const prewiewBuilding: MapBuilding = {
            building: buildings[buildingId - 1],
            MapBuildingId: "preview",
            position: { x: 0, y: 0 },
            edges: edges,
            rotation: 0,
            shape: shape,
            isSelected: false,
        }

        setBuildingPreview(prewiewBuilding);
    }



    return (
        <div className={styles.game}>
            <BuildingsBitmapProvider>
                <GameCanvas selectedBuilding={selectedBuilding} disableDynamicLoading={!options.infiniteMap} onMapClick={OnMapClick} />
            </BuildingsBitmapProvider>
            <GameBar setBuilding={OnPlaceSelect} />
        </div>
    );
};

export default Game;
