import { useMap } from "../../../hooks/fetches/useMap";
import type { MapGeneratingOptions, MapTile, Position } from "../../../types/Game/Grid";
import { useState, useEffect, useRef } from "react";
import MapLayer from "./MapLayer";
import { Stage } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import GridLayer from "./GridLayer";
import styles from "../../../styles/Game.module.css";
import useGameProperties from "../../../hooks/providers/useGameProperties";

const GameCanvas = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const stageRef = useRef<Konva.Stage | null>(null);

    const { CHUNK_SIZE, SCALE_BY, MIN_SCALE, MAX_SCALE, TILE_SIZE } = useGameProperties();

    const [stageScale, setStageScale] = useState(1);
    const [stagePosition, setStagePosition] = useState<Position>({ x: 0, y: 0 });

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(value, min));

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

        // Keep the zoom centered around the current cursor position.
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

    const handleDragMove = (event: KonvaEventObject<DragEvent>) => {
        setStagePosition({ x: event.target.x(), y: event.target.y() });
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

    const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

    const [mapOptions, setMapOptions] = useState<MapGeneratingOptions>({
        seed: 12345678,
        chunkSize: CHUNK_SIZE,
        startChunkPos: { x: -5, y: -5 },
        endChunkPos: { x: 5, y: 5 },
    });

    const [loadedChunks, setLoadedChunks] = useState<Record<string, MapTile[]>>();

    const { data: newChunks, loading, error } = useMap(mapOptions);

    useEffect(() => {
        let cancelled = false;

        const loadFonts = async () => {
            try {
                await document.fonts.load('16px "icons"');
                await document.fonts.ready;
            } finally {
                if (!cancelled) setFontsLoaded(true);
            }
        };

        loadFonts();
        return () => {
            cancelled = true;
        };
    }, []);

    const GetContent = () => {
        if (!fontsLoaded || (loading && !newChunks)) {
            return (
                <div>
                    <div>Loading map...</div>
                </div>
            );
        } else if (error) {
            return <div>Error while loading map: {error}</div>;
        } else {
            return (
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
                    onDragMove={handleDragMove}
                >
                    <MapLayer chunks={newChunks!} />
                    <GridLayer
                        opacity={0.35}
                        origin={{ x: mapOptions.startChunkPos.x, y: mapOptions.startChunkPos.y }}
                        chunkWidth={mapOptions.endChunkPos.x - mapOptions.startChunkPos.x + 1}
                        chunkHeight={mapOptions.endChunkPos.y - mapOptions.startChunkPos.y + 1}
                    />
                </Stage>
            );
        }
    };

    return (
        <div ref={containerRef} className={styles.canvas}>
            {GetContent()}
        </div>
    );
};

export default GameCanvas;
