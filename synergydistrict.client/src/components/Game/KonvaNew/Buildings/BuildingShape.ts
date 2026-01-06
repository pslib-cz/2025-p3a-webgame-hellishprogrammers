import type { BuildingTileType } from "../../../../types";
import type { Edge, EdgeSide, MapBuilding, Position } from "../../../../types/Game/Grid";

const BACKGROUND_COLOR_MAP: Record<string, string> = {
    extractional: "#1982C4",
    industrial: "#6A4C93",
    commercial: "#FF595E",
    residential: "#FFCA3A",
    recreational: "#8AC926",
};

const OUTLINE_COLOR_MAP: Record<string, string> = {
    default: "#19191921",
    building: "#191919",
    selected: "#FEFAE0",
    highlight: "#FEFAE0",
};

const ICON_COLOR = "#FEFAE0";

type OutlineKey = keyof typeof OUTLINE_COLOR_MAP;

const defaultOutlines: OutlineKey[] = ["default", "default", "default", "default"];

const prepareBuilding = () => {
    
}