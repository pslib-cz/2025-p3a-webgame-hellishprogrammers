import { useMap } from "../../../hooks/useMap";
import { useState, type ReactNode } from "react";
import type { MapGeneratingOptions, MapTile } from "../../../types/Grid";
import { Tile } from "./Tile";
import { Layer } from "react-konva";

type MapLayerProps = {
    TILE_MARGIN: number,
    TILE_SIZE: number,
    viewState: { x: number, y: number, scale: number }
    width: number,
    height: number
    grid: MapTile[][] | null
}

const MapLayer: React.FC<MapLayerProps> = ({TILE_MARGIN, TILE_SIZE, viewState, width, height, grid}) => {

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
                        hasIcon={tile.hasIcon}
                    />
                );
            }
        }

        if (tiles.length === 0) {
            return null;
        }

        return <>{tiles}</>;
    }

    return(
        <Layer>
            {getVisibleTiles()}
        </Layer>
    );
}

export default MapLayer;