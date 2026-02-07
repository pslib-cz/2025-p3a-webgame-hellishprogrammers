import { useState, useEffect, useRef, useCallback, type FC } from "react";
import MapLayer from "./MapLayer";
import { Stage } from "react-konva";
import type Konva from "konva";
import styles from "../../../styles/Game.module.css";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import { prepareChunk, type PreparedChunkCanvas } from "./Shapes/ChunkShape";
import { prepareGrid } from "./Shapes/GridShape";
import useFont from "../../../hooks/useFont";
import useStageTransform from "../../../hooks/useStateTransform";
import useChunkLoader from "../../../hooks/useChunkLoader";
import type { MapBuilding, MapTile, Position, ActiveSynergies } from "../../../types/Game/Grid";
import BuildingsLayer from "./BuildingsLayer";
import PreviewLayer from "./PreviewLayer";
import { CalculateValues, CanPlaceBuilding } from "../../../utils/PlacingUtils";
import { useGameOptions } from "../../../hooks/providers/useGameOptions";
import useGameMapData from "../../../hooks/providers/useMapData";
import GridLayer from "./GridLayer";
import { useGameData } from "../../../hooks/providers/useGameData";
import useGameResources from "../../../hooks/providers/useGameResources";
import useTileBitmaps from "../../../hooks/providers/useTileBitmaps";

const findIconOffset = (shape: MapBuilding["buildingType"]["shape"]): Position => {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] === "Icon") {
                return { x, y };
            }
        }
    }

    return { x: 0, y: 0 };
};

type GameCanvasProps = {
    disableDynamicLoading?: boolean;
    onMapClick: (position: Position) => void;
    onContext: () => void;
    onBuildingClick: (building: MapBuilding | null) => void;
    previewBuilding: MapBuilding | null;
    onPreviewMove?: (position: Position | null, isPlaceable: boolean) => void;
    highlightedEdges?: ActiveSynergies[];
};

const GameCanvas: FC<GameCanvasProps> = ({
    disableDynamicLoading = false,
    onMapClick,
    onContext,
    previewBuilding,
    onPreviewMove,
    onBuildingClick,
    highlightedEdges = [],
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const stageRef = useRef<Konva.Stage | null>(null);
    const chunkBitmapRef = useRef<Record<string, PreparedChunkCanvas>>({});
    const gridBitmapRef = useRef<ImageBitmap | null>(null);
    const lastPreviewRef = useRef<{ key: string | null; placeable: boolean }>({ key: null, placeable: false });
    const [grabbing, setGrabbing] = useState(false);

    const { CHUNK_SIZE, SCALE_BY, MIN_SCALE, MAX_SCALE, TILE_SIZE, RENDER_DISTANCE_CHUNKS, MAX_LOADED_CHUNKS } =
        useGameProperties();

    const { options } = useGameOptions();

    const { stageScale, stagePosition, handleWheel, handleDragEnd } = useStageTransform({
        stageRef,
        scaleBy: SCALE_BY,
        minScale: MIN_SCALE,
        maxScale: MAX_SCALE,
    });

    const { GameMapData, setGameMapData } = useGameMapData();
    const { synergies, naturalFeatures } = useGameData();
    const { GameResources } = useGameResources();
    const { tileBitmaps, loading: tileBitmapsLoading } = useTileBitmaps();

    const {
        loadedChunks,
        loading: chunksLoading,
        error: chunkError,
    } = useChunkLoader({
        seed: options.seed,
        chunkSize: CHUNK_SIZE,
        renderDistanceChunks: disableDynamicLoading ? 0 : RENDER_DISTANCE_CHUNKS,
        maxLoadedChunks: MAX_LOADED_CHUNKS,
        tileSize: TILE_SIZE,
        stageScale,
        stagePosition,
        viewport: dimensions,
        allowDynamicLoading: !disableDynamicLoading,
    });

    const [chunkBitmaps, setChunkBitmaps] = useState<Record<string, PreparedChunkCanvas>>({});
    const [previewTile, setPreviewTile] = useState<Position | null>(null);
    const [isPointerOverStage, setIsPointerOverStage] = useState(false);
    const [isPreviewPlaceable, setIsPreviewPlaceable] = useState(false);

    const getTileFromPointer = useCallback((): Position | null => {
        const stage = stageRef.current;
        if (!stage) return null;

        const pointer = stage.getPointerPosition();
        if (!pointer) return null;

        const scale = stage.scaleX();
        const position = stage.position();

        const worldX = (pointer.x - position.x) / scale;
        const worldY = (pointer.y - position.y) / scale;

        return {
            x: Math.floor(worldX / TILE_SIZE),
            y: Math.floor(worldY / TILE_SIZE),
        };
    }, [TILE_SIZE]);

    const updatePreviewFromPointer = useCallback(() => {
        if (!previewBuilding) {
            setPreviewTile(null);
            setIsPreviewPlaceable(false);
            if (lastPreviewRef.current.key !== null || lastPreviewRef.current.placeable !== false) {
                lastPreviewRef.current = { key: null, placeable: false };
                onPreviewMove?.(null, false);
            }
            return;
        }

        const tile = getTileFromPointer();
        if (!tile) {
            setPreviewTile(null);
            setIsPreviewPlaceable(false);
            return;
        }

        const iconOffset = findIconOffset(previewBuilding.buildingType.shape);
        const origin: Position = {
            x: tile.x - iconOffset.x,
            y: tile.y - iconOffset.y,
        };

        const placeable =
            CanPlaceBuilding(
                previewBuilding.buildingType.shape,
                origin,
                GameMapData.placedBuildingsMappped,
                GameMapData.loadedMapTiles,
            ) &&
            CalculateValues(
                { ...previewBuilding, position: origin },
                GameMapData.placedBuildingsMappped,
                naturalFeatures,
                synergies,
                GameResources,
                GameMapData.loadedMapTiles,
                GameMapData.ActiveNaturalFeatures,
            ) !== null;
        const key = `${origin.x};${origin.y}`;
        setPreviewTile(origin);
        setIsPreviewPlaceable(placeable);
        if (lastPreviewRef.current.key !== key || lastPreviewRef.current.placeable !== placeable) {
            lastPreviewRef.current = { key, placeable };
            onPreviewMove?.(origin, placeable);
        }
    }, [
        previewBuilding,
        getTileFromPointer,
        GameMapData.placedBuildingsMappped,
        GameMapData.loadedMapTiles,
        naturalFeatures,
        synergies,
        GameResources,
        onPreviewMove,
    ]);

    useEffect(() => {
        setGameMapData((prev) => ({
            ...prev,
            loadedChunks,
            loadedMapTiles: Object.values(loadedChunks)
                .flat()
                .reduce(
                    (acc, tile) => {
                        acc[`${tile.position.x};${tile.position.y}`] = tile;
                        return acc;
                    },
                    {} as Record<string, MapTile>,
                ),
        }));
    }, [loadedChunks, setGameMapData]);

    useEffect(() => {
        if (!isPointerOverStage) return;
        updatePreviewFromPointer();
    }, [stageScale, stagePosition, updatePreviewFromPointer, isPointerOverStage]);

    useEffect(() => {
        if (!previewBuilding) {
            setPreviewTile(null);
            setIsPreviewPlaceable(false);
            return;
        }

        if (isPointerOverStage) {
            updatePreviewFromPointer();
        }
    }, [previewBuilding, isPointerOverStage, updatePreviewFromPointer]);

    const handleStageOnClick = (evt: Konva.KonvaEventObject<PointerEvent>) => {
        if (evt.evt.button != 0) return;

        // If the click was on a building (Image element), let BuildingsLayer handle it
        if (evt.target && evt.target !== evt.currentTarget) {
            return;
        }

        const pointerTile = getTileFromPointer();
        if (!pointerTile) return;

        let placementTile: Position = pointerTile;

        const building = GameMapData.placedBuildingsMappped[`${pointerTile.x};${pointerTile.y}`];
        onBuildingClick(building ? building : null);
        if (building) return;

        if (previewBuilding) {
            const iconOffset = findIconOffset(previewBuilding.buildingType.shape);
            placementTile = {
                x: pointerTile.x - iconOffset.x,
                y: pointerTile.y - iconOffset.y,
            };
        }

        onMapClick(placementTile);
    };

    const handleStageContextMenu = (evt: Konva.KonvaEventObject<PointerEvent>) => {
        evt.evt.preventDefault();
        onContext();
    };

    const handleStageMouseEnter = useCallback(() => {
        setIsPointerOverStage(true);
        updatePreviewFromPointer();
    }, [updatePreviewFromPointer]);

    const handleStageMouseMove = useCallback(() => {
        if (!isPointerOverStage) {
            setIsPointerOverStage(true);
        }
        updatePreviewFromPointer();
    }, [isPointerOverStage, updatePreviewFromPointer]);

    const handleStageMouseLeave = useCallback(() => {
        setIsPointerOverStage(false);
        setPreviewTile(null);
        setIsPreviewPlaceable(false);
        if (lastPreviewRef.current.key !== null || lastPreviewRef.current.placeable !== false) {
            lastPreviewRef.current = { key: null, placeable: false };
            onPreviewMove?.(null, false);
        }
    }, []);

    const handleStageWheel = useCallback(
        (event: Konva.KonvaEventObject<WheelEvent>) => {
            handleWheel(event);
            if (!isPointerOverStage) return;
            requestAnimationFrame(() => updatePreviewFromPointer());
        },
        [handleWheel, updatePreviewFromPointer, isPointerOverStage],
    );

    const handleStageDragStart = useCallback(() => {
        setGrabbing(true);
    }, []);

    const handleStageDragMove = useCallback(() => {
        if (!isPointerOverStage) return;
        updatePreviewFromPointer();
    }, [isPointerOverStage, updatePreviewFromPointer]);

    const handleStageDragEnd = useCallback(() => {
        handleDragEnd();
        setGrabbing(false);
        if (!isPointerOverStage) return;
        requestAnimationFrame(() => updatePreviewFromPointer());
    }, [handleDragEnd, updatePreviewFromPointer, isPointerOverStage]);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    const fontsLoaded = useFont('16px "icons"');

    useEffect(() => {
        if (!fontsLoaded || tileBitmapsLoading) {
            return;
        }

        const prepared: Record<string, PreparedChunkCanvas> = {};

        for (const [key, tiles] of Object.entries(loadedChunks)) {
            const [chunkX, chunkY] = key.split(";").map(Number);
            const chunkOrigin = {
                x: chunkX * CHUNK_SIZE,
                y: chunkY * CHUNK_SIZE,
            };

            const chunkImage = prepareChunk({
                tiles,
                chunkOrigin,
                tileSize: TILE_SIZE,
                chunkSize: CHUNK_SIZE,
                tileBitmaps,
                debug: false,
            });

            if (chunkImage) {
                prepared[key] = chunkImage;
            }
        }

        setChunkBitmaps((prev) => {
            for (const bitmap of Object.values(prev)) {
                bitmap.img.close();
            }

            chunkBitmapRef.current = prepared;
            return prepared;
        });
    }, [loadedChunks, fontsLoaded, tileBitmapsLoading, tileBitmaps, TILE_SIZE, CHUNK_SIZE]);

    useEffect(() => {
        const gridImage = prepareGrid({
            opacity: 0.35,
            tileSize: TILE_SIZE,
            chunkSize: CHUNK_SIZE,
        });

        gridBitmapRef.current = gridImage ?? null;
    }, [TILE_SIZE, CHUNK_SIZE]);

    useEffect(() => {
        return () => {
            for (const bitmap of Object.values(chunkBitmapRef.current)) {
                bitmap.img.close();
            }
            chunkBitmapRef.current = {};

            if (gridBitmapRef.current) {
                gridBitmapRef.current.close();
                gridBitmapRef.current = null;
            }
        };
    }, []);

    return (
        <div ref={containerRef} className={`${styles.canvas} ${grabbing ? styles.grabbing : ""}`}>
            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                draggable={true}
                onWheel={handleStageWheel}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePosition.x}
                y={stagePosition.y}
                onMouseEnter={handleStageMouseEnter}
                onMouseMove={handleStageMouseMove}
                onMouseLeave={handleStageMouseLeave}
                onDragStart={handleStageDragStart}
                onDragMove={handleStageDragMove}
                onDragEnd={handleStageDragEnd}
                onClick={handleStageOnClick}
                onContextMenu={handleStageContextMenu}
            >
                <MapLayer
                    chunks={loadedChunks}
                    stageX={stagePosition.x}
                    stageY={stagePosition.y}
                    scale={stageScale}
                    width={dimensions.width}
                    height={dimensions.height}
                    chunkBitmaps={chunkBitmaps}
                />
                <GridLayer gridImage={gridBitmapRef.current} />
                <BuildingsLayer highlightedEdges={highlightedEdges} onBuildingClick={onBuildingClick} />
                <PreviewLayer
                    previewBuilding={previewBuilding}
                    position={previewTile}
                    isPlaceable={isPreviewPlaceable}
                />
            </Stage>
            {(chunksLoading || !fontsLoaded || tileBitmapsLoading) && (
                <div className={styles.overlay}>Loading map...</div>
            )}
            {chunkError && <div className={styles.overlay}>Error while loading map: {chunkError}</div>}
        </div>
    );
};

export default GameCanvas;
