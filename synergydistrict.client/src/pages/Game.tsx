import { useEffect, useState, useMemo } from "react";
import styles from "../styles/Game.module.css";
import GameCanvas from "../components/Game/Rendering/GameCanvas";
import GameBar from "./Game/GameBar/GameBar";
import { BuildingsBitmapProvider } from "../provider/BuildingsBitmapProvider";
import { useGameOptions } from "../hooks/providers/useGameOptions";
import type { MapBuilding, Position, ActiveSynergies } from "../types/Game/Grid";
import {
    CanPlaceBuilding,
    createEgdesForShape,
    CalculateValues,
    rotateShape,
    CanAfford,
    buildPlacedBuildingsMap,
    GetPreviewSynergies,
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
import PauseMenu from "./Game/PauseMenu/PauseMenu";
import VersionDisplay from "../components/VersionDisplay/VersionDisplay";
import { useSound } from "../hooks/useSound";

const Game = () => {
    const [activeBuildingType, setActiveBuildingType] = useState<BuildingType | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<MapBuilding | null>(null);
    const [buildingPreview, setBuildingPreview] = useState<MapBuilding | null>(null);
    const [buildingPreviewPosition, setBuildingPreviewPosition] = useState<Position | null>(null);
    const [, setBuildingPreviewPlaceable] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState(false);
    const [highlightedEdges, setHighlightedEdges] = useState<ActiveSynergies[]>([]);
    const [isDocsExiting, setIsDocsExiting] = useState(false);
    const [isDetailsExiting, setIsDetailsExiting] = useState(false);
    const [shouldRenderDocs, setShouldRenderDocs] = useState(false);
    const [shouldRenderDetails, setShouldRenderDetails] = useState(false);
    const [lastActiveBuildingType, setLastActiveBuildingType] = useState<BuildingType | null>(null);
    const [lastSelectedBuilding, setLastSelectedBuilding] = useState<MapBuilding | null>(null);
    const { options } = useGameOptions();
    const { GameMapData, setGameMapData } = useGameMapData();
    const { GameResources, setGameResources } = useGameResources();
    const { synergies, naturalFeatures } = useGameData();
    const { gameControl } = useGameControl();
    const { gameSettings } = useSettings();
    const playClick = useSound("CLICK");
    const playSelect = useSound("SELECT");
    const playError = useSound("ERROR");

    const { currentTrack } = useMusic({
        songsPath: ["/audio/game-music"],
        volume: 0.3,
        timeBetweenSongs: 10000,
        isEnabled: gameSettings.isMusic,
        mode: "random",
    });

    const previewSynergies = useMemo(() => {
        if (!activeBuildingType || !buildingPreview || !buildingPreviewPosition)
            return [] as import("../types/Game/Buildings").SynergyProjection[];

        return GetPreviewSynergies(
            buildingPreview.buildingType,
            buildingPreviewPosition,
            GameMapData.placedBuildingsMappped,
            naturalFeatures,
            synergies,
            GameMapData.loadedMapTiles,
            GameResources,
        );
    }, [
        activeBuildingType,
        buildingPreview?.buildingType.buildingId,
        buildingPreview?.rotation,
        buildingPreviewPosition?.x,
        buildingPreviewPosition?.y,
        GameMapData.placedBuildingsMappped,
        naturalFeatures,
        synergies,
        GameMapData.loadedMapTiles,
    ]);

    useEffect(() => {
        if (!gameControl.isEnd) return;
        setActiveBuildingType(null);
        setBuildingPreview(null);
    }, [gameControl.isEnd]);

    useEffect(() => {
        if (!gameControl.isEnd && activeBuildingType) {
            setLastActiveBuildingType(activeBuildingType);
            setShouldRenderDocs(true);
            setIsDocsExiting(false);
        } else if (shouldRenderDocs) {
            setIsDocsExiting(true);
            const timer = setTimeout(() => {
                setShouldRenderDocs(false);
                setIsDocsExiting(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeBuildingType, gameControl.isEnd]);

    useEffect(() => {
        if (!gameControl.isEnd && selectedBuilding) {
            setLastSelectedBuilding(selectedBuilding);
            setShouldRenderDetails(true);
            setIsDetailsExiting(false);
        } else if (shouldRenderDetails) {
            setIsDetailsExiting(true);
            const timer = setTimeout(() => {
                setShouldRenderDetails(false);
                setIsDetailsExiting(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [selectedBuilding, gameControl.isEnd]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                if (!gameControl.isEnd) {
                    setIsPaused((prev) => !prev);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameControl.isEnd]);

    const OnMapClick = (position: Position) => {
        if (activeBuildingType === null || buildingPreview === null || gameControl.isEnd) return;

        if (
            CanPlaceBuilding(
                buildingPreview.buildingType.shape,
                position,
                GameMapData.placedBuildingsMappped,
                GameMapData.loadedMapTiles,
            )
        ) {
            playClick();
            const newBuilding: MapBuilding = {
                buildingType: buildingPreview.buildingType,
                MapBuildingId: crypto.randomUUID(),
                position: position,
                rotation: buildingPreview!.rotation,
                level: 1,
                isSelected: false,
            };

            const newData = CalculateValues(
                newBuilding,
                GameMapData.placedBuildingsMappped,
                naturalFeatures,
                synergies,
                GameResources,
                GameMapData.loadedMapTiles,
                GameMapData.ActiveNaturalFeatures,
            );
            if (!newData) return;

            const newBuildings = [...GameMapData.placedBuildings, newBuilding];

            const newNaturalFeaturesMap = { ...(GameMapData.ActiveNaturalFeatures || {}) };

            newData.removedNaturalFeatureIds.forEach((id) => {
                delete newNaturalFeaturesMap[id];
            });

            newData.newNaturalFeatures.forEach((nf) => {
                newNaturalFeaturesMap[nf.id] = nf;
            });

            const remainingSynergies = GameMapData.activeSynergies.filter(
                (synergy) =>
                    !newData.removedNaturalFeatureIds.includes(synergy.sourceBuildingId) &&
                    !newData.removedNaturalFeatureIds.includes(synergy.targetBuildingId),
            );

            setGameResources(newData.newResources);

            setGameMapData((prev) => ({
                ...prev,
                activeSynergies: [...remainingSynergies, ...newData.newSynergies],
                placedBuildings: newBuildings,
                placedBuildingsMappped: buildPlacedBuildingsMap(newBuildings),
                ActiveNaturalFeatures: newNaturalFeaturesMap,
            }));

            if (!CanAfford(buildingPreview!.buildingType, newData.newResources, newBuildings)) setBuildingPreview(null);
        } else playError();
    };

    const OnPlaceSelect = (building: BuildingType | null) => {
        if (gameControl.isEnd) return;

        setActiveBuildingType(building);

        if (building === null || !CanAfford(building, GameResources, GameMapData.placedBuildings)) {
            if (building && !CanAfford(building, GameResources, GameMapData.placedBuildings)) {
                playError();
            }
            setBuildingPreview(null);
            return;
        }

        const prewiewBuilding: MapBuilding = {
            buildingType: building,
            MapBuildingId: "preview",
            position: { x: 0, y: 0 },
            rotation: 0,
            level: 1,
            isSelected: false,
        };

        setBuildingPreview(prewiewBuilding);
    };

    const OnRotate = () => {
        if (buildingPreview === null || gameControl.isEnd) return;

        playClick();
        const newShape = rotateShape(buildingPreview.buildingType.shape, 1);
        const newEdges = createEgdesForShape(newShape);
        setBuildingPreview((prev) => {
            if (!prev) return null;

            return {
                ...prev,
                buildingType: { ...prev.buildingType, shape: newShape, edges: newEdges },
                rotation: (prev.rotation + 1) % 4,
            };
        });
    };

    const OnBuildingClick = (building: MapBuilding | null) => {
        if (building) playSelect();

        const newBuildings: MapBuilding[] = GameMapData.placedBuildings.map((b) => {
            if (b.isSelected) b.isSelected = false;
            if (building && b.MapBuildingId === building.MapBuildingId) b.isSelected = true;
            if (selectedBuilding && b.MapBuildingId === selectedBuilding.MapBuildingId) b.isSelected = false;

            return b;
        });

        setSelectedBuilding((prev) =>
            prev && building && prev.MapBuildingId === building.MapBuildingId ? null : building,
        );

        if (!building) {
            setHighlightedEdges([]);
        }

        setGameMapData((prev) => ({
            ...prev,
            placedBuildings: newBuildings,
            placedBuildingsMappped: buildPlacedBuildingsMap(newBuildings),
        }));
    };

    return (
        <div className={styles.game}>
            <VersionDisplay />
            <BuildingsBitmapProvider>
                <GameCanvas
                    disableDynamicLoading={!options.infiniteMap}
                    onMapClick={OnMapClick}
                    onContext={OnRotate}
                    previewBuilding={buildingPreview}
                    onPreviewMove={(pos, isPlaceable) => {
                        setBuildingPreviewPosition(pos);
                        setBuildingPreviewPlaceable(!!isPlaceable);
                    }}
                    onBuildingClick={OnBuildingClick}
                    highlightedEdges={highlightedEdges}
                />
                {shouldRenderDocs && lastActiveBuildingType && (
                    <BuildingDocs 
                        building={lastActiveBuildingType} 
                        activeSynergies={previewSynergies} 
                        isExiting={isDocsExiting}
                    />
                )}
            </BuildingsBitmapProvider>
            {!gameControl.isEnd && currentTrack && gameSettings.isMusic && (
                <div className={styles.nowPlaying}>Now Playing: {currentTrack}</div>
            )}
            {shouldRenderDetails && lastSelectedBuilding && (
                <BuildingDetails 
                    building={lastSelectedBuilding} 
                    CloseBar={() => OnBuildingClick(null)} 
                    onHighlightEdges={setHighlightedEdges}
                    isExiting={isDetailsExiting}
                />
            )}
            {!gameControl.isEnd && <GameBar setBuilding={OnPlaceSelect} />}
            {gameControl.isEnd && <EndScreen />}
            {isPaused && !gameControl.isEnd && <PauseMenu onResume={() => setIsPaused(false)} />}
        </div>
    );
};

export default Game;
