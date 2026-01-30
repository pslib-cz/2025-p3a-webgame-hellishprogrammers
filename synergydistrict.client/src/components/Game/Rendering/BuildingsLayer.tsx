import type { FC } from "react";
import type { MapBuilding } from "../../../types/Game/Grid";
import { Layer, Image, Group, Shape, Circle, Text } from "react-konva";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import { useBuildingsBitmap } from "../../../hooks/providers/useBuildingsBitmap";
import { useImageBitmap } from "../../../hooks/useImage";
import useFont from "../../../hooks/useFont";

type BuildingsLayerProps = {
    buildings: MapBuilding[];
};

const SELECTION_OUTLINE_COLOR = "#FEFAE0";
const BUILDING_LEVEL_BACKGROUND = "#191919";
const BUILDING_LEVEL_NUMBER = "#FEFAE0";

const BuildingsLayer: FC<BuildingsLayerProps> = ({ buildings }) => {
    const { TILE_SIZE } = useGameProperties();
    const { buildingsBitmap } = useBuildingsBitmap();
    useFont("700 16px Space Mono");

    const { bitmap: err, loading } = useImageBitmap("/images/err.jpg");

    return (
        <Layer listening={false}>
            {loading ? (
                <></>
            ) : (
                buildings.map((building) => {
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
                        <Group key={building.MapBuildingId} zIndex={building.isSelected ? 1000 : 0}>
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
                                    strokeWidth={outlineStrokeWidth}
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
                })
            )}
        </Layer>
    );
};

export default BuildingsLayer;
