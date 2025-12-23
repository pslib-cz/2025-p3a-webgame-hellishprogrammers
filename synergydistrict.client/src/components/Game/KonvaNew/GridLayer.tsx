import type { Position } from "../../../types/Game/Grid";
import GridShape from "./GridShape";
import { Layer } from "react-konva";
import useGameProperties from "../../../hooks/providers/useGameProperties";

type GridLayerProp = {
    opacity: number;
    origin: Position;
    chunkWidth: number;
    chunkHeight: number;
}

const GridLayer: React.FC<GridLayerProp> = ({ opacity, origin, chunkWidth, chunkHeight }) => {

    const {TILE_SIZE, CHUNK_SIZE} = useGameProperties();

    const MapGrids = () => {
      //console.log(`Rendering GridLayer with origin (${origin.x}, ${origin.y}), chunkWidth: ${chunkWidth}, chunkHeight: ${chunkHeight}`);
      const grids = [];
      for (let i = 0; i < chunkWidth; i++) {
        for (let j = 0; j < chunkHeight; j++) {
          const pos: Position = {
            x: (origin.x + i) * CHUNK_SIZE * TILE_SIZE,
            y: (origin.y + j) * CHUNK_SIZE * TILE_SIZE,
          };
          grids.push(<GridShape key={`${i}-${j}`} opacity={opacity} pos={pos}/>);
        }
      }
      return grids;
    }

    return (
    <Layer listening={false}>
      {MapGrids()}
    </Layer>
  );
}

export default GridLayer;