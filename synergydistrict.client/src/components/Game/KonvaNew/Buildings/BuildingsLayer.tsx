import type { FC } from "react";
import type { MapBuilding } from "../../../../types/Game/Grid";
import { Layer, Image } from "react-konva";
import prepareBuilding from "./BuildingShape";
import { useMemo, useEffect } from "react";
import useGameProperties from "../../../../hooks/providers/useGameProperties";
import { rotateBuildingShape } from "../../../../utils/buildingUtils";
import { usePlacedBuildings } from "../../../../hooks/providers/usePlacedBuildings";

type BuildingsLayerProps = {
    placedBuildings: MapBuilding[];
    onBuildingClick?: (buildingInstanceId: string) => void;
};

const BuildingsLayer: FC<BuildingsLayerProps> = ({ placedBuildings, onBuildingClick }) => {
    const { TILE_SIZE } = useGameProperties();
    const { removeBuilding, getSelectedBuilding } = usePlacedBuildings();

    const buildingBitmaps = useMemo(() => {
        const bitmaps: Record<string, ReturnType<typeof prepareBuilding>> = {};

        for (const building of placedBuildings) {
            // Create a rotated version of the building for rendering
            const rotatedBuilding = {
                ...building,
                building: {
                    ...building.building,
                    shape: rotateBuildingShape(building.building.shape, building.rotation),
                },
            };

            const bitmap = prepareBuilding({
                building: rotatedBuilding,
                tileSize: TILE_SIZE,
                debug: false,
            });

            if (bitmap) {
                bitmaps[building.buildingInstanceId] = bitmap;
            }
        }

        return bitmaps;
    }, [placedBuildings, TILE_SIZE]);

    // Handle delete key to remove selected building
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete") {
                const selected = getSelectedBuilding();
                if (selected) {
                    removeBuilding(selected.buildingInstanceId);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [removeBuilding, getSelectedBuilding]);

    return (
        <Layer
            listening={true}
            onClick={(e) => {
                // Prevent event propagation
                e.cancelBubble = true;
            }}
        >
            {placedBuildings.map((building) => {
                const bitmap = buildingBitmaps[building.buildingInstanceId];
                if (!bitmap) return null;

                return (
                    <Image
                        key={building.buildingInstanceId}
                        x={building.position.x * TILE_SIZE}
                        y={building.position.y * TILE_SIZE}
                        width={bitmap.width}
                        height={bitmap.height}
                        image={bitmap.img}
                        listening={true}
                        onClick={() => {
                            onBuildingClick?.(building.buildingInstanceId);
                        }}
                        onContextMenu={(e) => {
                            e.evt.preventDefault();
                            removeBuilding(building.buildingInstanceId);
                        }}
                        opacity={building.isSelected ? 0.8 : 1}
                        shadowColor={building.isSelected ? "#FEFAE0" : undefined}
                        shadowBlur={building.isSelected ? 20 : undefined}
                    />
                );
            })}
        </Layer>
    );
};

export default BuildingsLayer;
