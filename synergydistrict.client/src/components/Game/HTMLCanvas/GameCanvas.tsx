import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "../../../hooks/fetches/useMap";
import useGameProperties from "../../../hooks/providers/useGameProperties"
import type { MapGeneratingOptions, Position } from "../../../types/Game/Grid";
import prepareChunk from "./ChunkShape";
import styles from "../../../styles/Game.module.css";
import prepareGrid from "./GridShape";
import useFont from "../../../hooks/useFont";

const GameCanvas = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const {
        CHUNK_SIZE,
        MAP_SEED,
        TILE_SIZE,
        MIN_SCALE,
        MAX_SCALE,
        RENDER_DISTANCE_CHUNKS: render_distance_chunks,
        MAX_LOADED_CHUNKS: max_loaded_chunks,
    } = useGameProperties();

    const [mapOptions, setMapOptions] = useState<MapGeneratingOptions>({
        chunkSize: CHUNK_SIZE,
        seed: MAP_SEED,
        startChunkPos: { x: -render_distance_chunks, y: -render_distance_chunks },
        endChunkPos: { x: render_distance_chunks, y: render_distance_chunks },
    });

    const { data: newChunks, loading, error } = useMap(mapOptions);
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fontsLoaded = useFont('16px "icons"');
    const chunksImgRef = useRef<Record<string, ImageBitmap>>({});
    const gridImgRef = useRef<ImageBitmap | null>(null);

    const [preparedVersion, setPreparedVersion] = useState(0);
    const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.5);
    const [centerChunk, setCenterChunk] = useState<Position>({ x: 0, y: 0 });

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

    useEffect(() => {
        const existing = chunksImgRef.current;
        if (Object.keys(existing).length === 0) {
            return;
        }

        for (const bitmap of Object.values(existing)) {
            if (typeof bitmap.close === "function") {
                bitmap.close();
            }
        }

        chunksImgRef.current = {};
        setPreparedVersion((prev) => prev + 1);
    }, [CHUNK_SIZE, TILE_SIZE, MAP_SEED]);

    const pruneChunks = useCallback(
        (source: Record<string, ImageBitmap>) => {
            let working = source;
            let changed = false;

            const removeChunk = (key: string) => {
                if (working === source) {
                    working = { ...source };
                }
                const bitmap = working[key];
                if (bitmap && typeof bitmap.close === "function") {
                    bitmap.close();
                }
                delete working[key];
                changed = true;
            };

            if (centerChunk) {
                for (const key of Object.keys(source)) {
                    const [chunkX, chunkY] = key.split(";").map(Number);
                    if (
                        Math.abs(chunkX - centerChunk.x) > render_distance_chunks ||
                        Math.abs(chunkY - centerChunk.y) > render_distance_chunks
                    ) {
                        removeChunk(key);
                    }
                }
            }

            if (centerChunk && max_loaded_chunks > 0) {
                const keys = Object.keys(working);
                if (keys.length > max_loaded_chunks) {
                    const sorted = keys
                        .map((key) => {
                            const [chunkX, chunkY] = key.split(";").map(Number);
                            const distance = Math.hypot(chunkX - centerChunk.x, chunkY - centerChunk.y);
                            return { key, distance };
                        })
                        .sort((a, b) => a.distance - b.distance);

                    const keep = new Set(sorted.slice(0, max_loaded_chunks).map((entry) => entry.key));

                    for (const key of keys) {
                        if (!keep.has(key)) {
                            removeChunk(key);
                        }
                    }
                }
            }

            return { next: working, changed };
        },
        [centerChunk, render_distance_chunks, max_loaded_chunks]
    );

    //prepare chunks when new ones arrive
    useEffect(() => {
        if (!fontsLoaded || !newChunks) {
            return;
        }

        let working = chunksImgRef.current;
        let changed = false;

        for (const [key, chunk] of Object.entries(newChunks)) {
            if (working[key]) {
                continue;
            }

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

            if (!preparedChunk) {
                continue;
            }

            if (working === chunksImgRef.current) {
                working = { ...chunksImgRef.current };
            }

            working[key] = preparedChunk.img;
            changed = true;
        }

        const { next, changed: pruned } = pruneChunks(working);
        if (changed || pruned) {
            chunksImgRef.current = next;
            setPreparedVersion((prev) => prev + 1);
        }
    }, [CHUNK_SIZE, TILE_SIZE, fontsLoaded, newChunks, pruneChunks]);

    useEffect(() => {
        const { next, changed } = pruneChunks(chunksImgRef.current);
        if (changed) {
            chunksImgRef.current = next;
            setPreparedVersion((prev) => prev + 1);
        }
    }, [centerChunk, pruneChunks]);

    //prepare grid image
    useEffect(() => {
        gridImgRef.current = prepareGrid({
            opacity: 0.2,
            tileSize: TILE_SIZE,
            chunkSize: CHUNK_SIZE,
        });
        setPreparedVersion((prev) => prev + 1);
    }, [CHUNK_SIZE, TILE_SIZE]);

    //draw loop
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

    //dragging logic
    useEffect(() => {
        viewportOffsetRef.current = viewportOffset;
    }, [viewportOffset]);

    //zoom logic
    useEffect(() => {
        zoomRef.current = zoom;
    }, [zoom]);

    //drag handlers
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

    //zoom handlers
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

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) {
            return;
        }

        const chunkSizeInPixels = CHUNK_SIZE * TILE_SIZE;
        if (chunkSizeInPixels === 0 || zoom === 0) {
            return;
        }

        const worldX = (dimensions.width / 2 - viewportOffset.x) / zoom;
        const worldY = (dimensions.height / 2 - viewportOffset.y) / zoom;

        const nextCenter = {
            x: Math.floor(worldX / chunkSizeInPixels),
            y: Math.floor(worldY / chunkSizeInPixels),
        };

        setCenterChunk((prev) => {
            if (prev && prev.x === nextCenter.x && prev.y === nextCenter.y) {
                return prev;
            }
            return nextCenter;
        });
    }, [dimensions.width, dimensions.height, viewportOffset.x, viewportOffset.y, zoom, CHUNK_SIZE, TILE_SIZE]);

    useEffect(() => {
        const startChunkPos = {
            x: centerChunk.x - render_distance_chunks,
            y: centerChunk.y - render_distance_chunks,
        };

        const endChunkPos = {
            x: centerChunk.x + render_distance_chunks,
            y: centerChunk.y + render_distance_chunks,
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
    }, [centerChunk, CHUNK_SIZE, MAP_SEED, render_distance_chunks]);

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