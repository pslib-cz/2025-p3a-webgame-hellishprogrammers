import type { FC } from "react";
import type { MapBuilding } from "../../../../types/Game/Grid";
import { Layer, Image } from "react-konva";
import useGameProperties from "../../../../hooks/providers/useGameProperties";
import { useBuildingsBitmap } from "../../../../hooks/providers/useBuildingsBitmap";

type BuildingsLayerProps = {
    buildings: MapBuilding[];
};

const BuildingsLayer: FC<BuildingsLayerProps> = ({ buildings }) => {
    const { TILE_SIZE } = useGameProperties();
    const { buildingsBitmap } = useBuildingsBitmap();

    return (
        <Layer listening={false}>
            {buildings.map((building) => {
                const bitmap = buildingsBitmap.find((x) => x.buildingId === building.building.buildingId);

                if (!bitmap) return null;
                return (
                    <Image
                        key={building.MapBuildingId}
                        x={building.position.x * TILE_SIZE}
                        y={building.position.y * TILE_SIZE}
                        width={bitmap.width}
                        height={bitmap.height}
                        image={bitmap.image}
                        listening={false}
                        rotation={building.rotation * 90}
                    />
                );
            })}
        </Layer>
    );
};

export default BuildingsLayer;
