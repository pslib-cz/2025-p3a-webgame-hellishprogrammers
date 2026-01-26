import { useEffect, useState } from "react";
import styles from "../styles/Game.module.css";
import GameCanvas from "../components/Game/Rendering/GameCanvas";
import GameBar from "./Game/GameBar/GameBar";
import { BuildingsBitmapProvider } from "../provider/BuildingsBitmapProvider";
import { useGameOptions } from "../hooks/providers/useGameOptions";
import type { MapBuilding, Position } from "../types/Game/Grid";
import {
    CanPlaceBuilding,
    createEgdesForShape,
    CalculateValues,
    rotateShape,
    CanAfford,
    buildPlacedBuildingsMap,
} from "../utils/PlacingUtils";
import type { BuildingType } from "../types/Game/Buildings";
import { useGameData } from "../hooks/providers/useGameData";
import useGameMapData from "../hooks/providers/useMapData";
import useGameResources from "../hooks/providers/useGameResources";
import EndScreen from "./Game/EndScreen/EndScreen";
import useGameControl from "../hooks/providers/useGameControl";
import BuildingDocs from "./Game/BuildingDocs/BuildingDocs";
import BuildingDetails from "./Game/BuildingDetails/BuildingDetails";
import { useSettings } from "../hooks/providers/useSettings";
import useMusic from "../hooks/useMusic";

const Game = () => {
    const [activeBuildingType, setActiveBuildingType] = useState<BuildingType | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<MapBuilding | null>(null);
    const [buildingPreview, setBuildingPreview] = useState<MapBuilding | null>(null);
    const { options } = useGameOptions();
    const { GameMapData, setGameMapData } = useGameMapData();
    const { GameResources, setGameResources } = useGameResources();
    const { synergies } = useGameData();
    const { gameControl } = useGameControl();
    const { gameSettings } = useSettings();
    
    const { currentTrack } = useMusic({
        songsPath: ["/audio/game-music"],
        volume: 0.3,
        timeBetweenSongs: 10000,
        isEnabled: gameSettings.isMusic,
        mode: 'random'
    });

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
                level: 1,
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
            level: 1,
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

    const OnBuildingClick = (building: MapBuilding | null) => {
        const newBuildings: MapBuilding[] = GameMapData.placedBuildings.map((b) => {
            // deselect selected building
            if (b.isSelected) b.isSelected = false;
            // select the building on which user clicks
            if (building && b.MapBuildingId === building.MapBuildingId) b.isSelected = true;
            // deselect if the building is already selected
            if (selectedBuilding && b.MapBuildingId === selectedBuilding.MapBuildingId) b.isSelected = false;

            return b;
        });

        setSelectedBuilding((prev) =>
            prev && building && prev.MapBuildingId === building.MapBuildingId ? null : building,
        );

        setGameMapData((prev) => ({
            ...prev,
            placedBuildings: newBuildings,
            placedBuildingsMappped: buildPlacedBuildingsMap(newBuildings),
        }));
    };

    return (
        <div className={styles.game}>
            <BuildingsBitmapProvider>
                <GameCanvas
                    disableDynamicLoading={!options.infiniteMap}
                    onMapClick={OnMapClick}
                    onContext={OnRotate}
                    previewBuilding={buildingPreview}
                    onBuildingClick={OnBuildingClick}
                />
                {!gameControl.isEnd && activeBuildingType && <BuildingDocs building={activeBuildingType} />}
            </BuildingsBitmapProvider>
            {!gameControl.isEnd && currentTrack && gameSettings.isMusic && <div className={styles.nowPlaying}>Now Playing: {currentTrack}</div>}
            {!gameControl.isEnd && selectedBuilding && (
                <BuildingDetails building={selectedBuilding} CloseBar={() => OnBuildingClick(null)} />
            )}
            {!gameControl.isEnd && <GameBar setBuilding={OnPlaceSelect} />}
            {gameControl.isEnd && <EndScreen />}
        </div>
    );
};

export default Game;
