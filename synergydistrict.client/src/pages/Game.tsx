import React from "react";
import { Stage, Layer } from "react-konva";
import { Tile } from "./Game/Tile";
import type { MapTile } from "../types/Grid";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

export default function Game() {
  const grid: MapTile[][] = []; // This would come from your game state/store

  // We use local state for immediate zoom feedback to ensure 60FPS smoothness
  const stageRef = React.useRef<any>(null);
  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = React.useState(1);

  const handleWheel = (e: any) => {
    e.evt.preventDefault(); // Stop browser scrolling

    const scaleBy = 1.1; // Speed of zoom
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition(); // Mouse position

    // Math to calculate new zoom level
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <>
      <Stage
        width={WIDTH}
        height={HEIGHT}
        draggable
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        ref={stageRef}
        // Save pan position when dragging ends
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
          {Array.from({ length: 10 }).map((_, x) =>
            Array.from({ length: 10 }).map((_, y) => {
              const key = `${x},${y}`;

              return (
                <Tile
                  key={key}
                  x={x}
                  y={y}
                  type={grid[x][y].type}
                  onClick={() => {}} // Example interaction
                />
              );
            })
          )}
        </Layer>
      </Stage>
    </>
  );
}
