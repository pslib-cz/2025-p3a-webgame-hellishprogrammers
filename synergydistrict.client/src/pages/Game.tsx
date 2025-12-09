import React from "react";
import { Stage, Layer } from "react-konva";
import { useStore } from "../hooks/store";
import { Tile } from "./Game/Gameplay/Tile";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

export default function Game() {
  const { grid, setBlock } = useStore();

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
              // Default to water if not set, or use what is in store
              const type = grid[key] || ((x + y) % 2 === 0 ? "grass" : "water");

              return (
                <Tile
                  key={key}
                  x={x}
                  y={y}
                  type={type}
                  onClick={() => setBlock(x, y, "building")} // Example interaction
                />
              );
            })
          )}
        </Layer>
      </Stage>
    </>
  );
}
