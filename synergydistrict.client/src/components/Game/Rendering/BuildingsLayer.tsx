import type { FC } from "react";
import type { MapBuilding, ActiveSynergies } from "../../../types/Game/Grid";
import { Layer, Image, Group, Shape, Circle, Text, Line } from "react-konva";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import { useBuildingsBitmap } from "../../../hooks/providers/useBuildingsBitmap";
import { useImageBitmap } from "../../../hooks/useImage";
import useFont from "../../../hooks/useFont";

type BuildingsLayerProps = {
    buildings: MapBuilding[];
    highlightedEdges?: ActiveSynergies[];
};

const SELECTION_OUTLINE_COLOR = "#191919";
const BUILDING_LEVEL_BACKGROUND = "#191919";
const BUILDING_LEVEL_NUMBER = "#FEFAE0";
const HIGHLIGHT_EDGE_COLOR = "#FEFAE0";
const OUTLINE_WIDTH = 4;

const BuildingsLayer: FC<BuildingsLayerProps> = ({ buildings, highlightedEdges = [] }) => {
    const { TILE_SIZE } = useGameProperties();
    const { buildingsBitmap } = useBuildingsBitmap();
    useFont("700 16px Space Mono");

    const { bitmap: err, loading } = useImageBitmap("/images/err.jpg");

    const getBuilding = (building: MapBuilding) => {
        const bitmap = buildingsBitmap[building.buildingType.buildingId]?.[building.rotation] || err;

        if (!bitmap) return null;
        const baseX = building.position.x * TILE_SIZE;
        const baseY = building.position.y * TILE_SIZE;
        const width = building.buildingType.shape[0].length * TILE_SIZE;
        const height = building.buildingType.shape.length * TILE_SIZE;
        const outlineStrokeWidth = Math.max(2, TILE_SIZE / 12);
        const tiles = building.buildingType.shape;

        const iconRowIndex = tiles.findIndex((row) => row.includes("Icon"));
        const iconColIndex = tiles[iconRowIndex].indexOf("Icon");
        const iconPosX = baseX + iconColIndex * TILE_SIZE + TILE_SIZE / 2 + (15 / 64) * TILE_SIZE;
        const iconPosY = baseY + iconRowIndex * TILE_SIZE + (20 / 64) * TILE_SIZE;
        return (
            <Group key={building.MapBuildingId}>
                <Image x={baseX} y={baseY} width={width} height={height} image={bitmap!} />
                {building.level > 1 ? (
                    <Group>
                        <Circle
                            x={iconPosX}
                            y={iconPosY}
                            width={TILE_SIZE / 4}
                            height={TILE_SIZE / 4}
                            fill={BUILDING_LEVEL_BACKGROUND}
                        />
                        <Text
                            x={iconPosX - TILE_SIZE / 16}
                            y={iconPosY - TILE_SIZE / 16}
                            width={TILE_SIZE / 8}
                            height={TILE_SIZE / 8}
                            text={building.level.toString()}
                            fill={BUILDING_LEVEL_NUMBER}
                            fontSize={TILE_SIZE / 6}
                            fontFamily="Space Mono"
                            fontStyle="bold"
                            align="center"
                            verticalAlign="middle"
                        />
                    </Group>
                ) : null}
                {building.isSelected ? (
                    <Shape
                        x={baseX}
                        y={baseY}
                        listening={false}
                        stroke={SELECTION_OUTLINE_COLOR}
                        strokeWidth={OUTLINE_WIDTH}
                        perfectDrawEnabled={false}
                        sceneFunc={(context, shape) => {
                            context.beginPath();
                            context.lineJoin = "round";
                            context.lineCap = "round";

                            for (let y = 0; y < tiles.length; y++) {
                                for (let x = 0; x < tiles[y].length; x++) {
                                    const tile = tiles[y][x];
                                    if (!tile || tile === "Empty") continue;

                                    const relX = x * TILE_SIZE;
                                    const relY = y * TILE_SIZE;

                                    const topTile = tiles[y - 1]?.[x];
                                    const rightTile = tiles[y]?.[x + 1];
                                    const bottomTile = tiles[y + 1]?.[x];
                                    const leftTile = tiles[y]?.[x - 1];

                                    const edgeStartX = relX;
                                    const edgeEndX = relX + TILE_SIZE;
                                    const edgeStartY = relY;
                                    const edgeEndY = relY + TILE_SIZE;

                                    if (!topTile || topTile === "Empty") {
                                        context.moveTo(edgeStartX, edgeStartY);
                                        context.lineTo(edgeEndX, edgeStartY);
                                    }

                                    if (!rightTile || rightTile === "Empty") {
                                        context.moveTo(edgeEndX, edgeStartY);
                                        context.lineTo(edgeEndX, edgeEndY);
                                    }

                                    if (!bottomTile || bottomTile === "Empty") {
                                        context.moveTo(edgeEndX, edgeEndY);
                                        context.lineTo(edgeStartX, edgeEndY);
                                    }

                                    if (!leftTile || leftTile === "Empty") {
                                        context.moveTo(edgeStartX, edgeEndY);
                                        context.lineTo(edgeStartX, edgeStartY);
                                    }
                                }
                            }

                            context.strokeShape(shape);
                        }}
                    />
                ) : null}
            </Group>
        );
    }

    const renderHighlightedEdges = () => {
        if (highlightedEdges.length === 0) return null;

        return highlightedEdges.map((synergy, idx) => {
            const sourceBuilding = buildings.find(b => b.MapBuildingId === synergy.sourceBuildingId);
            
            if (!sourceBuilding) return null;

            const edge = synergy.edge;
            const baseX = sourceBuilding.position.x * TILE_SIZE;
            const baseY = sourceBuilding.position.y * TILE_SIZE;
            
            const relX = edge.position.x * TILE_SIZE;
            const relY = edge.position.y * TILE_SIZE;
            
            let startX = baseX + relX;
            let startY = baseY + relY;
            let endX = startX;
            let endY = startY;
            
            switch (edge.side) {
                case "top":
                    startY = baseY + relY;
                    endY = baseY + relY;
                    endX = startX + TILE_SIZE;
                    break;
                case "right":
                    startX = baseX + relX + TILE_SIZE;
                    endX = baseX + relX + TILE_SIZE;
                    endY = startY + TILE_SIZE;
                    break;
                case "bottom":
                    startY = baseY + relY + TILE_SIZE;
                    endY = baseY + relY + TILE_SIZE;
                    endX = startX + TILE_SIZE;
                    break;
                case "left":
                    startX = baseX + relX;
                    endX = baseX + relX;
                    endY = startY + TILE_SIZE;
                    break;
            }
            
            const strokeWidth = OUTLINE_WIDTH;
            
            return (
                <Line
                    key={`highlight-${idx}-${synergy.sourceBuildingId}-${synergy.targetBuildingId}`}
                    points={[startX, startY, endX, endY]}
                    stroke={HIGHLIGHT_EDGE_COLOR}
                    strokeWidth={strokeWidth}
                    lineCap="round"
                    listening={false}
                />
            );
        });
    };

    return (
        <Layer listening={false}>
            {loading ? (
                <></>
            ) : (
                buildings.map((building) => {
                    return (
                        building.isSelected ? null : getBuilding(building)
                    );
                })
            )}
            {
                buildings.filter(b => b.isSelected).map(b => {
                    return getBuilding(b)
                })
            }
            {renderHighlightedEdges()}
        </Layer>
    );
};
export default BuildingsLayer;