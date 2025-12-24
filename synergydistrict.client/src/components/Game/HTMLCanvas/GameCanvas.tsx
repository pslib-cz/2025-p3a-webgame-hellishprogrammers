import { useEffect, useRef, useState } from "react";
import { useMap } from "../../../hooks/fetches/useMap";
import useGameProperties from "../../../hooks/providers/useGameProperties"
import type { MapGeneratingOptions, Position } from "../../../types/Game/Grid";
import prepareChunk from "./ChunkShape";
import styles from "../../../styles/Game.module.css";
import prepareGrid from "./GridShape";

const GameCanvas = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const { CHUNK_SIZE, MAP_SEED, TILE_SIZE, MIN_SCALE, MAX_SCALE, SCALES } = useGameProperties();

    const [mapOptions, setMapOptions] = useState<MapGeneratingOptions>({
        chunkSize: CHUNK_SIZE,
        seed: MAP_SEED,
        startChunkPos: { x: -10, y: -10 },
        endChunkPos: { x: 10, y: 10 },
    });

    const { data: newChunks, loading, error } = useMap(mapOptions);
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [ fontsLoaded, setFontsLoaded ] = useState<boolean>(false);
    const chunksImgRef = useRef<Record<string, ImageBitmap>>({});
    const gridImgRef = useRef<ImageBitmap | null>(null);
    const [preparedVersion, setPreparedVersion] = useState(0);
    const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.5);
    const dragStateRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
    } | null>(null);
    const viewportOffsetRef = useRef({ x: 0, y: 0 });
    const zoomRef = useRef(1);

    //use to set canvas dimensions
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


    //makes sure fonts are loaded
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

    useEffect(() => {
        if (!fontsLoaded || !newChunks) {
            return;
        }

        const prepared: Record<string, ImageBitmap> = {};
        for (const [key, chunk] of Object.entries(newChunks)) {
            const [originX, originY] = key.split(";").map(Number);
            const origin: Position = {
                x: originX * CHUNK_SIZE,
                y: originY * CHUNK_SIZE,
            };
            const preparedChunk = prepareChunk({
                tiles: chunk,
                chunkOrigin: origin,
                tileSize: TILE_SIZE,
                chunkSize: CHUNK_SIZE,
                debug: true,
            });
            if (preparedChunk) {
                prepared[key] = preparedChunk.img;
            }
        }

        chunksImgRef.current = prepared;
        setPreparedVersion((prev) => prev + 1);
    }, [CHUNK_SIZE, TILE_SIZE, fontsLoaded, newChunks])

    useEffect(() => {
        gridImgRef.current = prepareGrid({
            opacity: 0.2,
            tileSize: TILE_SIZE,
            chunkSize: CHUNK_SIZE,
        });
        setPreparedVersion((prev) => prev + 1);
    }, [CHUNK_SIZE, TILE_SIZE]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(zoom, 0, 0, zoom, viewportOffset.x, viewportOffset.y);
        const gridImg = gridImgRef.current;
        for (const [key, img] of Object.entries(chunksImgRef.current)) {
            const [originX, originY] = key.split(";").map(Number);
            const relX = originX * TILE_SIZE * CHUNK_SIZE;
            const relY = originY * TILE_SIZE * CHUNK_SIZE;
            context.drawImage(img, relX, relY);
            if (gridImg) {
                context.drawImage(gridImg, relX, relY);
            }
        }
        context.setTransform(1, 0, 0, 1, 0, 0);
    }, [preparedVersion, dimensions.width, dimensions.height, viewportOffset, CHUNK_SIZE, TILE_SIZE, zoom]);

    useEffect(() => {
        viewportOffsetRef.current = viewportOffset;
    }, [viewportOffset]);

    useEffect(() => {
        zoomRef.current = zoom;
    }, [zoom]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handlePointerDown = (event: PointerEvent) => {
            canvas.setPointerCapture(event.pointerId);
            dragStateRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                originX: viewportOffsetRef.current.x,
                originY: viewportOffsetRef.current.y,
            };
            canvas.style.cursor = "grabbing";
        };

        const handlePointerMove = (event: PointerEvent) => {
            const state = dragStateRef.current;
            if (!state || state.pointerId !== event.pointerId) return;
            const dx = event.clientX - state.startX;
            const dy = event.clientY - state.startY;
            const next = {
                x: state.originX + dx,
                y: state.originY + dy,
            };
            viewportOffsetRef.current = next;
            setViewportOffset(next);
        };

        const endDrag = (event: PointerEvent) => {
            const state = dragStateRef.current;
            if (!state || state.pointerId !== event.pointerId) return;
            dragStateRef.current = null;
            canvas.releasePointerCapture(event.pointerId);
            canvas.style.cursor = "grab";
        };

        const cancelDrag = () => {
            dragStateRef.current = null;
            canvas.style.cursor = "grab";
        };

        canvas.addEventListener("pointerdown", handlePointerDown);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerup", endDrag);
        canvas.addEventListener("pointercancel", cancelDrag);
        canvas.style.cursor = "grab";

        return () => {
            canvas.removeEventListener("pointerdown", handlePointerDown);
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerup", endDrag);
            canvas.removeEventListener("pointercancel", cancelDrag);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            const zoomDelta = Math.exp(-event.deltaY * 0.001);
            const targetZoom = zoomRef.current * zoomDelta;
            const clampedZoom = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetZoom));
            const scaleFactor = clampedZoom / zoomRef.current;
            if (scaleFactor === 1) return;

            const pointer = {
                x: event.offsetX,
                y: event.offsetY,
            };

            const worldX = (pointer.x - viewportOffsetRef.current.x) / zoomRef.current;
            const worldY = (pointer.y - viewportOffsetRef.current.y) / zoomRef.current;
            const nextOffset = {
                x: pointer.x - worldX * clampedZoom,
                y: pointer.y - worldY * clampedZoom,
            };

            viewportOffsetRef.current = nextOffset;
            zoomRef.current = clampedZoom;
            setViewportOffset(nextOffset);
            setZoom(clampedZoom);
        };

        canvas.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            canvas.removeEventListener("wheel", handleWheel);
        };
    }, [MAX_SCALE, MIN_SCALE]);

return (
  <div ref={containerRef} className={styles.canvas}>
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ display: "block" }}
    />

    {(loading || !fontsLoaded) && <div className={styles.overlay}>Loading map...</div>}
    {error && <div className={styles.overlay}>Error while loading map: {error}</div>}
  </div>
);
}

export default GameCanvas