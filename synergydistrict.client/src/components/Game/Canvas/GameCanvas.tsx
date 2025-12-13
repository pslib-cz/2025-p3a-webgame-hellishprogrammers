import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { useMap } from '../../../hooks/useMap';
import { Tile } from './Tile';
import type { MapGeneratingOptions } from '../../../types/Grid';
import MapLayer from './MapLayer';

type RendererProps = {
    //size: { width: number; height: number; };
}

export const Rendereder: React.FC<RendererProps> = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stageRef = useRef<Konva.Stage>(null);

    const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });
    const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

    const CHUNK_SIZE = 16;

    const SCALE_BY = 1.15;
    const MIN_SCALE = 0.01;
    const MAX_SCALE = 5;
    const TILE_SIZE = 64;
    const TILE_MARGIN = 2;

        const [mapOptions, setMapOptions] = useState<MapGeneratingOptions>(() => ({
            seed: 12345678,
            renderDistanceX: 2,
            renderDistanceY: 2,
            chunkSize: CHUNK_SIZE,
            positionX: 0,
            positionY: 0,
        }));
    
        const { data: grid, loading, error } = useMap(mapOptions);

    const updateViewState = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) {
            return;
        }

        const next = {
            x: stage.x(),
            y: stage.y(),
            scale: stage.scaleX(),
        };

        setViewState((prev) => {
            const deltaX = Math.abs(prev.x - next.x);
            const deltaY = Math.abs(prev.y - next.y);
            const deltaScale = Math.abs(prev.scale - next.scale);

            if (deltaX < 0.5 && deltaY < 0.5 && deltaScale < 0.001) {
                return prev;
            }

            return next;
        });
    }, []);

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

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? 1 : -1;
        direction = -direction;


        let newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);

        updateViewState();
    };

    const handleDragMove = () => {
        updateViewState();
    };

    const handleDragEnd = () => {
        updateViewState();
    };

    useEffect(() => {
        const stage = stageRef.current;
        if (stage) {
            updateViewState();
        }
    }, [updateViewState, grid]);

    useEffect(() => {
        const centerWorldX = (width / 2 - viewState.x) / viewState.scale;
        const centerWorldY = (height / 2 - viewState.y) / viewState.scale;

        const centerTileX = centerWorldX / TILE_SIZE;
        const centerTileY = centerWorldY / TILE_SIZE;

        const nextPositionX = Math.floor(centerTileX / CHUNK_SIZE);
        const nextPositionY = Math.floor(centerTileY / CHUNK_SIZE);

        setMapOptions((prev) => {
            if (prev.positionX === nextPositionX && prev.positionY === nextPositionY) {
                return prev;
            }

            return {
                ...prev,
                positionX: nextPositionX,
                positionY: nextPositionY,
            };
        });
    }, [viewState, width, height, TILE_SIZE, CHUNK_SIZE]);

    const GetContent = () => {
        if (!fontsLoaded || (loading && !grid)) {
            return <div><div>Loading map...</div><div style={{ fontFamily: "icons" }}></div></div>
        }
        else if (error) {
            return <div>Error while loading map: {error}</div>
        }
        else {
            return <Stage
                width={width}
                height={height}
                ref={stageRef}
                onWheel={handleWheel}
                draggable={true}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                <MapLayer width={width} height={height} TILE_MARGIN={TILE_MARGIN} TILE_SIZE={TILE_SIZE} viewState={viewState} grid={grid}/>
            </Stage>
        }
    }

    return (
        <>
            {GetContent()}
        </>
    );
};