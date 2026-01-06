import { useMap } from "../../../hooks/fetches/useMap";
import { type MapGeneratingOptions, type MapTile, type Position } from "../../../types/Game/Grid";
import { useState, useEffect, useRef, type FC } from "react";
import MapLayer from "./MapLayer";
import BuildingsLayer from "./Buildings/BuildingsLayer";
import PreviewLayer from "./PreviewLayer";
import { Stage } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import styles from "../../../styles/Game.module.css";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import { prepareChunk, type PreparedChunkCanvas } from "../HTMLCanvas/ChunkShape";
import { prepareGrid } from "../HTMLCanvas/GridShape";
import useFont from "../../../hooks/useFont";
import { usePlacedBuildings } from "../../../hooks/providers/usePlacedBuildings";
import { useGameData } from "../../../hooks/providers/useGameData";
import { detectSynergies, calculateTotalProduction, rotateBuildingShape } from "../../../utils/buildingUtils";
import useGameVariables from "../../../hooks/providers/useGameVariables";

type GameCanvasProps = {
    selectedBuilding: number | null;
};

const GameCanvas: FC<GameCanvasProps> = ({ selectedBuilding }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const stageRef = useRef<Konva.Stage | null>(null);
    const chunkBitmapRef = useRef<Record<string, PreparedChunkCanvas>>({});
    const gridBitmapRef = useRef<ImageBitmap | null>(null);

    const {
        CHUNK_SIZE,
        SCALE_BY,
        MIN_SCALE,
        MAX_SCALE,
        TILE_SIZE,
        RENDER_DISTANCE_CHUNKS,
        MAX_LOADED_CHUNKS,
        MAP_SEED,
    } = useGameProperties();

    const [stageScale, setStageScale] = useState(1);
    const [stagePosition, setStagePosition] = useState<Position>({ x: 0, y: 0 });
    const [centerChunk, setCenterChunk] = useState<Position | null>(null);
    const [chunkBitmaps, setChunkBitmaps] = useState<Record<string, PreparedChunkCanvas>>({});

    const { placedBuildings, placeBuilding, selectBuilding } = usePlacedBuildings();
    const { buildings, synergies } = useGameData();
    const { setVariables } = useGameVariables();

    const [placementMode, setPlacementMode] = useState<{ buildingId: number; rotation: number } | null>(null);
    const [previewPosition, setPreviewPosition] = useState<Position | null>(null);
    const [canPlace, setCanPlace] = useState(true);

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(value, min));

    const isPlacementValid = (buildingDef: any, position: Position, rotation: number): boolean => {
        // Get rotated shape
        const rotatedShape = rotateBuildingShape(buildingDef.shape, rotation);

        // Check each tile of the building
        for (let x = 0; x < rotatedShape.length; x++) {
            const column = rotatedShape[x];
            if (!column) continue;

            for (let y = 0; y < column.length; y++) {
                const tile = column[y];
                if (!tile || tile === "Empty") continue;

                const tileX = position.x + x;
                const tileY = position.y + y;

                // Check terrain - find the chunk and tile
                const chunkX = Math.floor(tileX / CHUNK_SIZE);
                const chunkY = Math.floor(tileY / CHUNK_SIZE);
                // Handle negative coordinates correctly
                const localX = ((tileX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
                const localY = ((tileY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
                const chunkKey = `${chunkX};${chunkY}`;

                const chunk = loadedChunks[chunkKey];
                if (!chunk) {
                    // Chunk not loaded, assume valid
                    continue;
                }

                const chunkTileIndex = localY * CHUNK_SIZE + localX;
                const mapTile = chunk[chunkTileIndex];

                // Can only place on grass
                if (!mapTile || mapTile.tileType !== "grass") {
                    return false;
                }

                // Check for collisions with existing buildings
                for (const placedBuilding of placedBuildings) {
                    // Get rotated shape of placed building
                    const placedRotatedShape = rotateBuildingShape(
                        placedBuilding.building.shape,
                        placedBuilding.rotation
                    );

                    for (let px = 0; px < placedRotatedShape.length; px++) {
                        const placedColumn = placedRotatedShape[px];
                        if (!placedColumn) continue;

                        for (let py = 0; py < placedColumn.length; py++) {
                            const placedTile = placedColumn[py];
                            if (!placedTile || placedTile === "Empty") continue;

                            const placedTileX = placedBuilding.position.x + px;
                            const placedTileY = placedBuilding.position.y + py;

                            if (tileX === placedTileX && tileY === placedTileY) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        return true;
    };

    const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
        event.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const direction = event.evt.deltaY > 0 ? -1 : 1;
        const zoomFactor = direction > 0 ? SCALE_BY : 1 / SCALE_BY;
        const oldScale = stageScale;
        const nextScale = clamp(oldScale * zoomFactor, MIN_SCALE, MAX_SCALE);
        if (nextScale === oldScale) return;
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        const newPosition = {
            x: pointer.x - mousePointTo.x * nextScale,
            y: pointer.y - mousePointTo.y * nextScale,
        };
        setStageScale(nextScale);
        setStagePosition(newPosition);
    };

    const handleDragEnd = () => {
        const stage = stageRef.current;
        if (!stage) return;
        const pos = stage.position();
        setStagePosition(pos);
    };

    const handleStageClick = () => {
        const stage = stageRef.current;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const worldX = (pointer.x - stagePosition.x) / stageScale;
        const worldY = (pointer.y - stagePosition.y) / stageScale;

        const tileX = Math.floor(worldX / TILE_SIZE);
        const tileY = Math.floor(worldY / TILE_SIZE);

        // If in placement mode, place the building on left-click
        if (placementMode) {
            const buildingDef = buildings.find((b: any) => b.buildingId === placementMode.buildingId);
            if (!buildingDef) return;

            // Check if placement is valid
            if (!isPlacementValid(buildingDef, { x: tileX, y: tileY }, placementMode.rotation)) {
                return;
            }

            // Place the building
            placeBuilding(buildingDef, { x: tileX, y: tileY }, placementMode.rotation);
        } else {
            // If not in placement mode, deselect any selected building
            selectBuilding(null);
        }
    };

    const handleStageContextMenu = (e: KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault();

        // Only allow right-click rotation during placement mode
        if (!placementMode) return;

        setPlacementMode((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                rotation: (prev.rotation + 1) % 4,
            };
        });
    };

    const handleMouseMove = () => {
        if (!placementMode) {
            setPreviewPosition(null);
            return;
        }

        const stage = stageRef.current;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const worldX = (pointer.x - stagePosition.x) / stageScale;
        const worldY = (pointer.y - stagePosition.y) / stageScale;

        const tileX = Math.floor(worldX / TILE_SIZE);
        const tileY = Math.floor(worldY / TILE_SIZE);

        setPreviewPosition({ x: tileX, y: tileY });

        const buildingDef = buildings.find((b: any) => b.buildingId === placementMode.buildingId);
        if (buildingDef) {
            setCanPlace(isPlacementValid(buildingDef, { x: tileX, y: tileY }, placementMode.rotation));
        }
    };

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

    // Handle selectedBuilding change to enter placement mode
    useEffect(() => {
        if (selectedBuilding !== null) {
            setPlacementMode({ buildingId: selectedBuilding, rotation: 0 });
        } else {
            setPlacementMode(null);
        }
    }, [selectedBuilding]);

    // Update game variables when buildings are placed or removed
    useEffect(() => {
        const detectedSynergies = detectSynergies(placedBuildings, synergies);
        const totalProduction = calculateTotalProduction(placedBuildings, detectedSynergies);

        // Update game variables with production values
        setVariables((prev) => {
            let updated = { ...prev };
            for (const [type, value] of totalProduction) {
                if (type === "money") updated = { ...updated, moneyPerTick: value };
                // Add more production types mapping as needed (energy, people, etc.)
            }
            return updated;
        });
    }, [placedBuildings, synergies, setVariables]);

    const fontsLoaded = useFont('16px "icons"');

    const [mapOptions, setMapOptions] = useState<MapGeneratingOptions>({
        seed: MAP_SEED,
        chunkSize: CHUNK_SIZE,
        startChunkPos: { x: -RENDER_DISTANCE_CHUNKS, y: -RENDER_DISTANCE_CHUNKS },
        endChunkPos: { x: RENDER_DISTANCE_CHUNKS, y: RENDER_DISTANCE_CHUNKS },
    });

    const [loadedChunks, setLoadedChunks] = useState<Record<string, MapTile[]>>({});

    const { data: newChunks, loading, error } = useMap(mapOptions);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;

        const chunkSizeInPixels = CHUNK_SIZE * TILE_SIZE;
        const worldCenterX = (dimensions.width / 2 - stagePosition.x) / stageScale;
        const worldCenterY = (dimensions.height / 2 - stagePosition.y) / stageScale;

        const nextCenter = {
            x: Math.floor(worldCenterX / chunkSizeInPixels),
            y: Math.floor(worldCenterY / chunkSizeInPixels),
        };

        setCenterChunk((prev) => {
            if (prev && prev.x === nextCenter.x && prev.y === nextCenter.y) {
                return prev;
            }
            return nextCenter;
        });
    }, [dimensions.width, dimensions.height, stagePosition.x, stagePosition.y, stageScale, CHUNK_SIZE, TILE_SIZE]);

    useEffect(() => {
        if (!centerChunk) return;

        const startChunkPos = {
            x: centerChunk.x - RENDER_DISTANCE_CHUNKS,
            y: centerChunk.y - RENDER_DISTANCE_CHUNKS,
        };
        const endChunkPos = {
            x: centerChunk.x + RENDER_DISTANCE_CHUNKS,
            y: centerChunk.y + RENDER_DISTANCE_CHUNKS,
        };

        setMapOptions((prev) => {
            if (
                prev.seed === MAP_SEED &&
                prev.chunkSize === CHUNK_SIZE &&
                prev.startChunkPos.x === startChunkPos.x &&
                prev.startChunkPos.y === startChunkPos.y &&
                prev.endChunkPos.x === endChunkPos.x &&
                prev.endChunkPos.y === endChunkPos.y
            ) {
                return prev;
            }

            return {
                seed: MAP_SEED,
                chunkSize: CHUNK_SIZE,
                startChunkPos,
                endChunkPos,
            };
        });
    }, [centerChunk, RENDER_DISTANCE_CHUNKS, CHUNK_SIZE, MAP_SEED]);

    useEffect(() => {
        if (!newChunks) return;

        setLoadedChunks((prev) => {
            let hasChanges = false;
            const combined: Record<string, MapTile[]> = { ...prev };

            for (const [key, value] of Object.entries(newChunks)) {
                if (combined[key] !== value) {
                    combined[key] = value;
                    hasChanges = true;
                }
            }

            let finalChunks = combined;

            if (centerChunk && MAX_LOADED_CHUNKS > 0) {
                const keys = Object.keys(combined);
                if (keys.length > MAX_LOADED_CHUNKS) {
                    const sorted = keys
                        .map((key) => {
                            const [chunkX, chunkY] = key.split(";").map(Number);
                            const distance = Math.hypot(chunkX - centerChunk.x, chunkY - centerChunk.y);
                            return { key, distance };
                        })
                        .sort((a, b) => a.distance - b.distance);

                    finalChunks = sorted.slice(0, MAX_LOADED_CHUNKS).reduce<Record<string, MapTile[]>>((acc, entry) => {
                        acc[entry.key] = combined[entry.key];
                        return acc;
                    }, {});

                    hasChanges = true;
                }
            }

            return hasChanges ? finalChunks : prev;
        });
    }, [newChunks, centerChunk, MAX_LOADED_CHUNKS]);

    useEffect(() => {
        if (!fontsLoaded) {
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
    }, [loadedChunks, fontsLoaded, TILE_SIZE, CHUNK_SIZE]);

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
        <div ref={containerRef} className={styles.canvas}>
            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                draggable={true}
                onWheel={handleWheel}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePosition.x}
                y={stagePosition.y}
                onDragEnd={handleDragEnd}
                onClick={handleStageClick}
                onContextMenu={handleStageContextMenu}
                onMouseMove={handleMouseMove}
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
                <BuildingsLayer placedBuildings={placedBuildings} onBuildingClick={(id) => selectBuilding(id)} />
                {placementMode && (
                    <PreviewLayer
                        building={buildings.find((b: any) => b.buildingId === placementMode.buildingId)}
                        position={previewPosition}
                        rotation={placementMode.rotation}
                        canPlace={canPlace}
                    />
                )}
                {/* <GridLayer
                            origin={{ x: mapOptions.startChunkPos.x, y: mapOptions.startChunkPos.y }}
                            chunkWidth={mapOptions.endChunkPos.x - mapOptions.startChunkPos.x + 1}
                            chunkHeight={mapOptions.endChunkPos.y - mapOptions.startChunkPos.y + 1}
                            gridImage={gridBitmap}
                        /> */}
            </Stage>
            {(loading || !fontsLoaded) && <div className={styles.overlay}>Loading map...</div>}
            {error && <div className={styles.overlay}>Error while loading map: {error}</div>}
        </div>
    );
};

export default GameCanvas;
