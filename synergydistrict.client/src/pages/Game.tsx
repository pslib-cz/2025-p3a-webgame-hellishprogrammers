import { useEffect, useState } from "react";
import styles from "../styles/Game.module.css";
import GameCanvas from "../components/Game/Rendering/GameCanvas";
import GameBar from "./Game/GameBar/GameBar";
import { BuildingsBitmapProvider } from "../provider/BuildingsBitmapProvider";
import { useGameOptions } from "../hooks/providers/useGameOptions";
import type { MapBuilding, Position } from "../types/Game/Grid";
import { CanPlaceBuilding, createEgdesForShape, CalculateValues, rotateShape, CanAfford } from "../utils/PlacingUtils";
import type { BuildingType } from "../types/Game/Buildings";
import { useGameData } from "../hooks/providers/useGameData";
import useGameMapData from "../hooks/providers/useMapData";
import useGameResources from "../hooks/providers/useGameResources";
import EndScreen from "./Game/EndScreen/EndScreen";
import useGameControl from "../hooks/providers/useGameControl";
import BuildingDocs from "./Game/BuildingDocs/BuildingDocs";

const Game = () => {
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
    const [buildingPreview, setBuildingPreview] = useState<MapBuilding | null>(null);
    const { options } = useGameOptions();
    const { GameMapData, setGameMapData } = useGameMapData();
    const { GameResources, setGameResources } = useGameResources();
    const { synergies } = useGameData();
    const { gameControl } = useGameControl();

    useEffect(() => {
        if (!gameControl.isEnd) return;
        setSelectedBuilding(null);
        setBuildingPreview(null);
    }, [gameControl.isEnd]);

    const OnMapClick = (position: Position) => {
        if (selectedBuilding === null || gameControl.isEnd) return;

        if (
            CanPlaceBuilding(
                buildingPreview!.shape,
                position,
                GameMapData.placedBuildingsMappped,
                GameMapData.loadedMapTiles
            ) &&
            CanAfford(buildingPreview!.buildingType, GameResources)
        ) {
            const newBuilding: MapBuilding = {
                buildingType: selectedBuilding,
                MapBuildingId: crypto.randomUUID(),
                position: position,
                edges: buildingPreview!.edges,
                rotation: buildingPreview!.rotation,
                shape: buildingPreview!.shape,
                isSelected: false,
            };

            const newValues = CalculateValues(
                newBuilding,
                GameMapData.placedBuildingsMappped,
                synergies,
                GameResources
            );
            if (!newValues) return;

            setGameResources(newValues);

            setGameMapData((prev) => ({
                ...prev,
                placedBuildings: [...prev.placedBuildings, newBuilding],
                placedBuildingsMappped: {
                    ...prev.placedBuildingsMappped,
                    ...Object.fromEntries(
                        newBuilding.shape
                            .map((row, y) =>
                                row
                                    .map((tile, x) =>
                                        tile !== "Empty"
                                            ? [
                                                  `${newBuilding.position.x + x};${newBuilding.position.y + y}`,
                                                  newBuilding,
                                              ]
                                            : null
                                    )
                                    .filter((entry): entry is [string, MapBuilding] => entry !== null)
                            )
                            .flat()
                    ),
                },
            }));
            if (!CanAfford(buildingPreview!.buildingType, newValues)) setBuildingPreview(null);
        }
    };

    const OnPlaceSelect = (building: BuildingType | null) => {
        if (gameControl.isEnd) return;

        setSelectedBuilding(building);

        if (building === null || !CanAfford(building, GameResources)) {
            setBuildingPreview(null);
            return;
        }

        const shape = building.shape;
        const edges = createEgdesForShape(shape);

        const prewiewBuilding: MapBuilding = {
            buildingType: building,
            MapBuildingId: "preview",
            position: { x: 0, y: 0 },
            edges: edges,
            rotation: 0,
            shape: shape,
            isSelected: false,
        };

        setBuildingPreview(prewiewBuilding);
    };

    const OnRotate = () => {
        if (buildingPreview === null || gameControl.isEnd) return;

        const newRotation = (buildingPreview.rotation + 1) % 4;
        const newShape = rotateShape(buildingPreview.shape, 1);
        const newEdges = createEgdesForShape(newShape);
        setBuildingPreview({
            ...buildingPreview,
            rotation: newRotation,
            shape: newShape,
            edges: newEdges,
        });
    };

    return (
        <div className={styles.game}>
            <BuildingsBitmapProvider>
                <GameCanvas
                    disableDynamicLoading={!options.infiniteMap}
                    onMapClick={OnMapClick}
                    onContext={OnRotate}
                    previewBuilding={buildingPreview}
                />
            </BuildingsBitmapProvider>
            {!gameControl.isEnd && <GameBar setBuilding={OnPlaceSelect} />}
            {!gameControl.isEnd && selectedBuilding && <BuildingDocs building={selectedBuilding} />}
            {gameControl.isEnd && <EndScreen />}
        </div>
    );
};

export default Game;
