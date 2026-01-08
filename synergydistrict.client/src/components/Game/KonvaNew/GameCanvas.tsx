import { useState, useEffect, useRef, type FC, use } from "react";
import MapLayer from "./MapLayer";
import { Stage } from "react-konva";
import type Konva from "konva";
import styles from "../../../styles/Game.module.css";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import { prepareChunk, type PreparedChunkCanvas } from "../HTMLCanvas/ChunkShape";
import { prepareGrid } from "../HTMLCanvas/GridShape";
import useFont from "../../../hooks/useFont";
import useStageTransform from "../../../hooks/useStateTransform";
import useChunkLoader from "../../../hooks/useChunkLoader";
import type { MapBuilding, MapTile, Position } from "../../../types/Game/Grid";
import BuildingsLayer from "./Buildings/BuildingsLayer";
import useGameVariables from "../../../hooks/providers/useGameVariables";

type GameCanvasProps = {
    disableDynamicLoading?: boolean;
    onMapClick: (position: Position) => void;
};

const GameCanvas: FC<GameCanvasProps> = ({ disableDynamicLoading = false , onMapClick}) => {
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

    const { stageScale, stagePosition, handleWheel, handleDragEnd } = useStageTransform({
        stageRef,
        scaleBy: SCALE_BY,
        minScale: MIN_SCALE,
        maxScale: MAX_SCALE,
    });

    const { variables, setVariables } = useGameVariables();

    const {
        loadedChunks,
        loading: chunksLoading,
        error: chunkError,
    } = useChunkLoader({
        seed: MAP_SEED,
        chunkSize: CHUNK_SIZE,
        renderDistanceChunks: RENDER_DISTANCE_CHUNKS,
        maxLoadedChunks: MAX_LOADED_CHUNKS,
        tileSize: TILE_SIZE,
        stageScale,
        stagePosition,
        viewport: dimensions,
        allowDynamicLoading: !disableDynamicLoading,
    });

    useEffect(() => {
        setVariables((prev) => ({...prev, loadedChunks, loadedMapTiles: Object.values(loadedChunks).flat().reduce((acc, tile) => {
            acc[`${tile.position.x};${tile.position.y}`] = tile;
            return acc;
        }, {} as Record<string, MapTile>) }) );
    }, [loadedChunks]);
    const [chunkBitmaps, setChunkBitmaps] = useState<Record<string, PreparedChunkCanvas>>({});

    const handleOnClick = (e: MouseEvent) => {

        const tileX = Math.floor((e.offsetX - stagePosition.x) / (TILE_SIZE * stageScale));
        const tileY = Math.floor((e.offsetY - stagePosition.y) / (TILE_SIZE * stageScale));

        onMapClick({ x: tileX, y: tileY });
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

    const fontsLoaded = useFont('16px "icons"');

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
                debug: true,
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
                onClick={(ek) => handleOnClick(ek.evt)}
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
                <BuildingsLayer buildings={variables.placedBuildings} />
                {/* <GridLayer
                            origin={}
                            chunkWidth={}
                            chunkHeight={}
                            gridImage={gridBitmap}
                        /> */}
            </Stage>
            {(chunksLoading || !fontsLoaded) && <div className={styles.overlay}>Loading map...</div>}
            {chunkError && <div className={styles.overlay}>Error while loading map: {chunkError}</div>}
        </div>
    );
};

export default GameCanvas;
