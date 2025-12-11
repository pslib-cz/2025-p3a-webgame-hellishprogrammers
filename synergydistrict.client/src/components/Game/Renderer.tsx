import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { useMap } from '../../hooks/useMap';
import { Tile } from './Tile';
import type { MapGeneratingOptions } from '../../types/Grid';

type RendererProps = {
    size: { width: number; height: number; };
}

export const Rendereder: React.FC<RendererProps> = ({ size }) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stageRef = useRef<Konva.Stage>(null);

    const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });

    const SCALE_BY = 1.15;
    const MIN_SCALE = 0.7;
    const MAX_SCALE = 5;
    const TILE_SIZE = 64;
    const TILE_MARGIN = 2;

    const mapOptions: MapGeneratingOptions = useMemo(() => ({
        seed: 12345678,
        renderDistanceX: 1,
        renderDistanceY: 1,
        chunkSize: 16,
        positionX: 0,
        positionY: 0,
    }), [size.height, size.width]);

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

    const getVisibleTiles = () => {
        if (!grid) {
            return null;
        }

        const { x: stageX, y: stageY, scale } = viewState;
        const inverseScale = 1 / scale;

        const viewLeftPx = (-stageX) * inverseScale;
        const viewTopPx = (-stageY) * inverseScale;
        const viewRightPx = (width - stageX) * inverseScale;
        const viewBottomPx = (height - stageY) * inverseScale;

        const marginPx = TILE_MARGIN * TILE_SIZE;

        const cullLeft = viewLeftPx - marginPx;
        const cullRight = viewRightPx + marginPx;
        const cullTop = viewTopPx - marginPx;
        const cullBottom = viewBottomPx + marginPx;

        const tiles: ReactNode[] = [];

        for (const row of grid) {
            for (const tile of row) {
                const tileLeft = tile.position.x * TILE_SIZE;
                const tileTop = tile.position.y * TILE_SIZE;
                const tileRight = tileLeft + TILE_SIZE;
                const tileBottom = tileTop + TILE_SIZE;

                const isOutside =
                    tileRight < cullLeft ||
                    tileLeft > cullRight ||
                    tileBottom < cullTop ||
                    tileTop > cullBottom;

                if (isOutside) {
                    continue;
                }

                tiles.push(
                    <Tile
                        key={`${tile.position.x}-${tile.position.y}`}
                        x={tile.position.x}
                        y={tile.position.y}
                        type={tile.tileType}
                    />
                );
            }
        }

        if (tiles.length === 0) {
            return null;
        }

        return <>{tiles}</>;
    }

    const getContent = () => {
        if (loading) {
            return <div>Loading map...</div>;
        }
        else if (error != null) {
            return <div>Error loading map: {error}</div>;
        }
        else {
            return (
                <Stage
                    width={width}
                    height={height}
                    ref={stageRef}
                    onWheel={handleWheel}
                    draggable={true}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <Layer>
                        {getVisibleTiles()}
                    </Layer>
                </Stage>
            );
        }
    }

    return getContent();
};