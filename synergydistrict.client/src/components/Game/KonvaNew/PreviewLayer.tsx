import type { FC } from "react";
import type { Position } from "../../../types/Game/Grid";
import type { BuildingType } from "../../../types/Game/Buildings";
import { Layer, Rect } from "react-konva";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import { rotateBuildingShape } from "../../../utils/buildingUtils";

type PreviewLayerProps = {
    building: BuildingType | undefined;
    position: Position | null;
    rotation: number;
    canPlace: boolean;
};

const PreviewLayer: FC<PreviewLayerProps> = ({ building, position, rotation, canPlace }) => {
    const { TILE_SIZE } = useGameProperties();

    if (!building || !position) {
        return null;
    }

    const rotatedShape = rotateBuildingShape(building.shape, rotation);
    const color = canPlace ? "rgba(200, 200, 200, 0.5)" : "rgba(255, 0, 0, 0.5)";

    return (
        <Layer listening={false}>
            {rotatedShape.map((column, x) =>
                column?.map((tile, y) => {
                    if (!tile || tile === "Empty") return null;

                    return (
                        <Rect
                            key={`preview-${x}-${y}`}
                            x={(position.x + x) * TILE_SIZE}
                            y={(position.y + y) * TILE_SIZE}
                            width={TILE_SIZE}
                            height={TILE_SIZE}
                            fill={color}
                            stroke={canPlace ? "rgba(150, 150, 150, 0.8)" : "rgba(200, 0, 0, 0.8)"}
                            strokeWidth={2}
                        />
                    );
                })
            )}
        </Layer>
    );
};

export default PreviewLayer;
