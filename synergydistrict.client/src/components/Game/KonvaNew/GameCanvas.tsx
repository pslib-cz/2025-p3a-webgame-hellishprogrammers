import { useMap } from "../../../hooks/useMap";
import type { MapGeneratingOptions, MapTile } from "../../../types/Grid";
import { useState, useEffect, useRef } from "react";
import MapLayer from "./MapLayer";
import { Stage } from "react-konva";
import GridLayer from "./GridLayer";
import styles from "../../../styles/Game.module.css";

const GameCanvas = () => {

      const containerRef = useRef<HTMLDivElement>(null);
      const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const CHUNK_SIZE = 16;
    const SCALE_BY = 1.15;
    const MIN_SCALE = 0.9;
    const MAX_SCALE = 5;
    const TILE_SIZE = 64;

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
        startChunkPos: { x: -2, y: 0 },
        endChunkPos: { x: 2, y: 0 }
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
        }
        else {
            return (

                <Stage width={dimensions.width} height={dimensions.height} draggable={true}>
                    <MapLayer chunks={newChunks!} TILE_SIZE={TILE_SIZE} />
                    <GridLayer mapHeightTiles={dimensions.height / TILE_SIZE} mapWidthTiles={dimensions.width / TILE_SIZE} TILE_SIZE={TILE_SIZE} opacity={.35}/>
                </Stage>
            );
        }
    };

    return (
        <div ref={containerRef} className={styles.canvas}>
            { GetContent() }
        </div>
    );
}

export default GameCanvas;