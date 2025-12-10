import React from "react";
import { Group, Rect, Text } from "react-konva";

const CELL_SIZE = 64;

// Memoized color lookup for better performance
const COLOR_MAP: Record<string, string> = {
  "water": "#5d8a9e",
  "grass": "#8a9e5d",
  "mountain": "#9e7b5d",
  "forest": "#4f6e45",
  "building": "#d15c5c",
};

const getColor = (type: string): string => {
  const normalized = type?.toLowerCase() ?? "";
  return COLOR_MAP[normalized] ?? "#ccc";
};

export const Tile = React.memo(({ x, y, type, }: { x: number; y: number; type: string; }) => {
  const color = getColor(type);
  
  return (
    <Group
      x={x * CELL_SIZE}
      y={y * CELL_SIZE}
      listening={false}
    >
      <Rect
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={color}
        stroke="#444"
        strokeWidth={1}
        listening={false}
      />

      <Text text={`${x},${y}`} fontSize={10} fill="rgba(0,0,0,0.5)" padding={5} listening={false}/>
    </Group>
  );
});
