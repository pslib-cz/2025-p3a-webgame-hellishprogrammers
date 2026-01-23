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

const buildPlacedBuildingsMap = (buildings: MapBuilding[]): Record<string, MapBuilding> => {
    const mapped: Record<string, MapBuilding> = {};

    for (const building of buildings) {
        for (let y = 0; y < building.shape.length; y++) {
            const row = building.shape[y];
            for (let x = 0; x < row.length; x++) {
                if (row[x] === "Empty") continue;
                const key = `${building.position.x + x};${building.position.y + y}`;
                mapped[key] = building;
            }
        }
    }

    return mapped;
};

const Game = () => {
    const [activeBuildingType, setActiveBuildingType] = useState<BuildingType | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<MapBuilding | null>(null);
    const [buildingPreview, setBuildingPreview] = useState<MapBuilding | null>(null);
    const { options } = useGameOptions();
    const { GameMapData, setGameMapData } = useGameMapData();
    const { GameResources, setGameResources } = useGameResources();
    const { synergies } = useGameData();
    const { gameControl } = useGameControl();

    useEffect(() => {
        if (!gameControl.isEnd) return;
        setActiveBuildingType(null);
        setBuildingPreview(null);
    }, [gameControl.isEnd]);

    const OnMapClick = (position: Position) => {
        if (activeBuildingType === null || buildingPreview === null || gameControl.isEnd) return;

        if (
            CanPlaceBuilding(
                buildingPreview!.shape,
                position,
                GameMapData.placedBuildingsMappped,
                GameMapData.loadedMapTiles,
            )
        ) {
            const newBuilding: MapBuilding = {
                buildingType: activeBuildingType,
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
                GameResources,
            );
            if (!newValues) return;

            setGameResources(newValues.newValues);

            const newBuildings = [...GameMapData.placedBuildings, newBuilding].map((b) => {
                const changedBuilding = newValues.newSynergiesBuildings.find(
                    (bi) => bi.MapBuildingId === b.MapBuildingId,
                );
                return changedBuilding ? changedBuilding : b;
            });

            const buildingsToUpdate = [newBuilding, ...newValues.newSynergiesBuildings];

            setGameMapData((prev) => ({
                ...prev,
                placedBuildings: newBuildings,
                placedBuildingsMappped: buildPlacedBuildingsMap(newBuildings),
            }));
            if (!CanAfford(buildingPreview!.buildingType, newValues.newValues)) setBuildingPreview(null);
        }
    };

    const OnPlaceSelect = (building: BuildingType | null) => {
        if (gameControl.isEnd) return;

        setActiveBuildingType(building);

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
                    onBuildingClick={(building: MapBuilding) => {
                        if (selectedBuilding) {
                            selectedBuilding.isSelected = false;
                            if (selectedBuilding.MapBuildingId === building.MapBuildingId) {
                                setSelectedBuilding(null);
                                return;
                            }
                        }
                        building.isSelected = true;
                        setSelectedBuilding(building);
                    }}
                />
                {!gameControl.isEnd && activeBuildingType && <BuildingDocs building={activeBuildingType} />}
            </BuildingsBitmapProvider>
            {!gameControl.isEnd && <GameBar setBuilding={OnPlaceSelect} />}
            {gameControl.isEnd && <EndScreen />}
        </div>
    );
};

export default Game;
