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
    const { getSelectedBuilding } = usePlacedBuildings();

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

                const handleClick = (e: any) => {
                    // Check if click hit a non-transparent pixel
                    const pos = e.target.getRelativePointerPosition();
                    if (!pos) return;

                    const canvas = document.createElement("canvas");
                    canvas.width = bitmap.width;
                    canvas.height = bitmap.height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    ctx.drawImage(bitmap.img as any, 0, 0);

                    const x = Math.floor(pos.x);
                    const y = Math.floor(pos.y);

                    if (x < 0 || x >= bitmap.width || y < 0 || y >= bitmap.height) return;

                    const imageData = ctx.getImageData(x, y, 1, 1);
                    const alpha = imageData.data[3];

                    // Only select if clicked on a non-transparent pixel (alpha > 128)
                    if (alpha > 128) {
                        onBuildingClick?.(building.buildingInstanceId);
                    }
                };

                return (
                    <Image
                        key={building.buildingInstanceId}
                        x={building.position.x * TILE_SIZE}
                        y={building.position.y * TILE_SIZE}
                        width={bitmap.width}
                        height={bitmap.height}
                        image={bitmap.img}
                        listening={true}
                        onClick={handleClick}
                        opacity={building.isSelected ? 0.8 : 1}
                    />
                );
            })}
        </Layer>
    );
};

export default BuildingsLayer;
