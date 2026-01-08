import { use, type FC } from "react";
import type { MapBuilding } from "../../../types/Game/Grid";
import { Layer, Image } from "react-konva";
import useGameProperties from "../../../hooks/providers/useGameProperties";
import { useBuildingsBitmap } from "../../../hooks/providers/useBuildingsBitmap";
import { useImageBitmap } from "../../../hooks/useImage";

type BuildingsLayerProps = {
    buildings: MapBuilding[];
};

const BuildingsLayer: FC<BuildingsLayerProps> = ({ buildings }) => {
    const { TILE_SIZE } = useGameProperties();
    const { buildingsBitmap } = useBuildingsBitmap();

    const { bitmap: err, loading, error } = useImageBitmap("/images/err.jpg");

    return (
        <Layer listening={false}>
            {loading ? <></> : buildings.map((building) => {
                const bitmap = buildingsBitmap[building.building.buildingId]?.[building.rotation] || err; 

                if (!bitmap) return null;
                return (
                    <Image
                        key={building.MapBuildingId}
                        x={building.position.x * TILE_SIZE}
                        y={building.position.y * TILE_SIZE}
                        width={building.shape[0].length * TILE_SIZE}
                        height={building.shape.length * TILE_SIZE}
                        image={bitmap!}
                        listening={false}
                        //rotation={building.rotation * 90}
                    />
                );
            })}
        </Layer>
    );
};

export default BuildingsLayer;
