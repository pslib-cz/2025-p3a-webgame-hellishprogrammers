import type { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { useMap } from '../../hooks/useMap';
import { Tile } from './Tile';

type RendererProps = {
    size: { width: number; height: number; };
}

export const Rendereder: React.FC<RendererProps> = ({size}) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stageRef = useRef<Konva.Stage>(null);

    const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });

    const SCALE_BY = 1.15;
    const MIN_SCALE = 0.7;
    const MAX_SCALE = 5;
    const TILE_SIZE = 64;
    const TILE_MARGIN = 2;
    const EDGE_MARGIN_TILES = 2;

    const { data: grid, loading, error } = useMap(size.width, size.height);

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

    const clampStagePosition = useCallback((stage: Konva.Stage, attempted?: { x: number; y: number; }) => {
        if (!grid) {
            return attempted ?? { x: stage.x(), y: stage.y() };
        }

        const rowCount = grid.length;
        const colCount = grid[0]?.length ?? 0;

        if (rowCount === 0 || colCount === 0) {
            return attempted ?? { x: stage.x(), y: stage.y() };
        }

        const marginPx = EDGE_MARGIN_TILES * TILE_SIZE;
        const mapWidthPx = colCount * TILE_SIZE;
        const mapHeightPx = rowCount * TILE_SIZE;
        const scale = stage.scaleX();

        const viewWidth = width / scale;
        const viewHeight = height / scale;

        const minVisibleX = -marginPx;
        const maxVisibleX = mapWidthPx + marginPx - viewWidth;
        const minVisibleY = -marginPx;
        const maxVisibleY = mapHeightPx + marginPx - viewHeight;

        let clampedX = attempted?.x ?? stage.x();
        let clampedY = attempted?.y ?? stage.y();

        if (minVisibleX > maxVisibleX) {
            clampedX = width / 2 - (mapWidthPx * scale) / 2;
        } else {
            const viewLeft = (-clampedX) / scale;
            if (viewLeft < minVisibleX) {
                clampedX = -minVisibleX * scale;
            } else if (viewLeft > maxVisibleX) {
                clampedX = -maxVisibleX * scale;
            }
        }

        if (minVisibleY > maxVisibleY) {
            clampedY = height / 2 - (mapHeightPx * scale) / 2;
        } else {
            const viewTop = (-clampedY) / scale;
            if (viewTop < minVisibleY) {
                clampedY = -minVisibleY * scale;
            } else if (viewTop > maxVisibleY) {
                clampedY = -maxVisibleY * scale;
            }
        }

        if (!attempted) {
            stage.position({ x: clampedX, y: clampedY });
        }

        return { x: clampedX, y: clampedY };
    }, [grid, height, width]);

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

        clampStagePosition(stage);

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
            clampStagePosition(stage);
            updateViewState();
        }
    }, [clampStagePosition, updateViewState, grid]);

    const getVisibleTiles = () => {
        if (!grid) {
            return null;
        }

        const rowCount = grid.length;
        const colCount = grid[0]?.length ?? 0;

        if (rowCount === 0 || colCount === 0) {
            return null;
        }

        const { x: stageX, y: stageY, scale } = viewState;
        const inverseScale = 1 / scale;

        const viewLeft = (-stageX) * inverseScale;
        const viewTop = (-stageY) * inverseScale;
        const viewRight = (width - stageX) * inverseScale;
        const viewBottom = (height - stageY) * inverseScale;

        const startX = Math.max(0, Math.floor(viewLeft / TILE_SIZE) - TILE_MARGIN);
        const endX = Math.min(colCount - 1, Math.ceil(viewRight / TILE_SIZE) + TILE_MARGIN);
        const startY = Math.max(0, Math.floor(viewTop / TILE_SIZE) - TILE_MARGIN);
        const endY = Math.min(rowCount - 1, Math.ceil(viewBottom / TILE_SIZE) + TILE_MARGIN);

        if (startX > endX || startY > endY) {
            return null;
        }

        const tiles: ReactNode[] = [];

        for (let y = startY; y <= endY; y += 1) {
            const row = grid[y];
            for (let x = startX; x <= endX; x += 1) {
                const tile = row[x];
                tiles.push(
                    <Tile
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        type={tile.tileType}
                    />
                );
            }
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
                    dragBoundFunc={(pos) => {
                        const stage = stageRef.current;
                        if (!stage) {
                            return pos;
                        }
                        return clampStagePosition(stage, pos);
                    }}
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