import { Group, Rect, Text } from "react-konva";

const CELL_SIZE = 64;

export const Tile = ({ x, y, type, onClick }: { x: number; y: number; type: string; onClick: () => void }) => {
  // Simple color mapping based on your images
  const getColor = (t: string) => {
    switch (t) {
      case "water":
        return "#5d8a9e";
      case "grass":
        return "#8a9e5d";
      case "mountain":
        return "#9e7b5d";
      case "forest":
        return "#4f6e45";
      case "building":
        return "#d15c5c"; // Red building from your 2nd image
      default:
        return "#ccc";
    }
  };

  return (
    <Group
      x={x * CELL_SIZE}
      y={y * CELL_SIZE}
      onClick={onClick}
      onTap={onClick} // For mobile support
    >
      {/* The Block Visual */}
      <Rect
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={getColor(type)}
        stroke="#444" // The dark border seen in your image
        strokeWidth={1}
      />

      {/* Debug Text (Optional) */}
      <Text text={`${x},${y}`} fontSize={10} fill="rgba(0,0,0,0.5)" padding={5} />
    </Group>
  );
};
