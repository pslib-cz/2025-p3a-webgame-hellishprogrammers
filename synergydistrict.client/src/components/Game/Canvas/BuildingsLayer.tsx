import { useState, type ReactNode } from "react";
import type { Edge, MapBuilding, MapGeneratingOptions, MapTile, Position } from "../../../types/Grid";
import { Tile } from "./Tile";
import { Group, Layer } from "react-konva";

type BuildingsLayerProps = {
    TILE_MARGIN: number,
    TILE_SIZE: number,
    viewState: { x: number, y: number, scale: number }
    width: number,
    height: number
    buildings: MapBuilding[] | null
}

const BuildingsLayer: React.FC<BuildingsLayerProps> = ({ TILE_MARGIN, TILE_SIZE, viewState, width, height, buildings }) => {

    const getTileOutline = (position: Position, building: MapBuilding) => {

        if (building.shape[position.x][position.y] == "Empty") {
            return null;
        }

        const edges: Edge[] = building.edges.filter(e => e.position.x == position.x && e.position.y == position.y);
        const outlines = ["default", "default", "default", "default"]
        if (edges == null) {
            return outlines;
        }

        for (const edge of edges) {
            const outline = building.isSelected ? "selected" : edge.synergy == null ? "building" : "highlight";
            switch (edge.side) {
                case "top":
                    outlines[0] = outline
                    break;
                case "bottom":
                    outlines[2] = outline
                    break;
                case "left":
                    outlines[3] = outline
                    break;
                case "right":
                    outlines[1] = outline
                    break;
                default:
                    break;
            }
        }

        return outlines;
    }

    const getGridBuilding = (building: MapBuilding, cullBottom: number, cullLeft: number, cullRight: number, cullTop: number): ReactNode => {

        const tiles: ReactNode[] = [];
        for (let i = 0; i < building.shape.length; i++) {
            const row = building.shape[i];

            for (let j = 0; j < row.length; j++) {
                const tile = row[j];

                const tileLeft = i + building.position.x * TILE_SIZE;
                const tileTop = j + building.position.y * TILE_SIZE;
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

                if (tile == "Empty") {
                    continue;
                }
                tiles.push(
                    <Tile
                        key={`${i + building.position.x}-${j + building.position.y}`}
                        x={i + building.position.x}
                        y={j + building.position.y}
                        type={building.buildingType.category}
                        iconKey={tile == "Icon" ? building.buildingType.name : ""}
                        outline={getTileOutline({ x: i, y: j}, building) ?? []}
                    />
                );
            }
        }

        return (
            <Group key={`${building.position.x}-${building.position.y}`}>
                {tiles}
            </Group>
        );
    }

        const getVisibleTiles = () => {
        if (!buildings) {
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

        const GridBuildings: ReactNode[] = [];

        for (const building of buildings) {
            GridBuildings.push(getGridBuilding(building, cullBottom, cullLeft, cullRight, cullTop));
        }

        if (GridBuildings.length === 0) {
            return null;
        }

        return <>{GridBuildings}</>;
    }

    return (
        <Layer>
            {getVisibleTiles()}
        </Layer>
    );
}

export default BuildingsLayer;