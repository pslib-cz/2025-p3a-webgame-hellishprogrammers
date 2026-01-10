import type { BuildingTileType } from "../types";
import type { BuildingSynergy, BuildingType, Production } from "../types/Game/Buildings";
import type { GameVariablesValue } from "../types/Game/GameVariables";
// import type { BuildingType } from "../types/Game/Buildings";
import type { Edge, EdgeSide, MapBuilding, MapTile } from "../types/Game/Grid";

export const CanPlaceBuilding = (
    shape: BuildingTileType[][],
    position: { x: number; y: number },
    placedBuildingsMappped: Record<string, MapBuilding>,
    loadedMapTiles: Record<string, MapTile>
): boolean => {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] != "Empty") {
                const tileX = position.x + x;
                const tileY = position.y + y;
                const key = `${tileX};${tileY}`;
                if (placedBuildingsMappped[key]) {
                    const building = placedBuildingsMappped[key];
                    const otherX = tileX - building.position.x;
                    const otherY = tileY - building.position.y;
                    if (building.shape[otherY][otherX] != "Empty") {
                        return false; // Kolize s další budovou (velký špatný)
                    }
                }
                if (!loadedMapTiles[key]) {
                    return false; // Pokus o umístění mimo načtené chunky (idk asi error možná spravit?)
                }
                const tileType = loadedMapTiles[key].tileType.toLowerCase();
                if (tileType == "water" || tileType == "mountain") {
                    return false;
                }
            }
        }
    }
    return true;
};

// Is enough values to build
export const isSufficientFunds = (
    building: MapBuilding,
    placedBuildingsMappped: Record<string, MapBuilding>,
    synergies: BuildingSynergy[],
    variables: GameVariablesValue
): boolean => {
    // Checking price is less or equal balance
    if (building.building.cost > variables.moneyBalance) return false;

    // Checking if final production is possitive or null
    if (!IsProductionSumValid(building.building.baseProduction, variables)) return false;

    // Checking if energy and money usage won't be more than it can be
    if (
        building.building.baseProduction.some((x) => {
            (x.type === "Energy" && x.value < 0 && variables.energy + x.value < variables.energyUsed) ||
                (x.type === "Money" && x.value < 0 && variables.people + x.value < variables.peopleUsed);
        })
    ) {
        return false;
    }

    for (const edge of building.edges) {
        let delX = 0;
        let delY = 0;
        let side: EdgeSide;
        switch (edge.side) {
            case "top":
                delY = -1;
                side = "bottom";
                break;
            case "bottom":
                delY = 1;
                side = "top";
                break;
            case "left":
                delX = -1;
                side = "right";
                break;
            case "right":
                delX = 1;
                side = "left";
                break;
        }

        const neighborKey = `${building.position.x + edge.position.x + delX};${
            building.position.y + edge.position.y + delY
        }`;
        const neighbor = placedBuildingsMappped[neighborKey];

        if (neighbor) {
            const activeSynergies = synergies.filter(
                (s) =>
                    (s.sourceBuildingId === building.building.buildingId &&
                        s.targetBuildingId === neighbor.building.buildingId) ||
                    (s.sourceBuildingId === neighbor.building.buildingId &&
                        s.targetBuildingId === building.building.buildingId)
            );

            if (activeSynergies.length === 0) continue;

            for (const synergy of activeSynergies) {
                if (!IsProductionSumValid(synergy.synergyProduction, variables)) return false;
            }
        }
    }
    return true;
};

// WARNING: Might be bug. When more than one production are negative
const IsProductionSumValid = (products: Production[], variables: GameVariablesValue): boolean => {
    for (const product of products) {
        const resourceKey = product.type.toLowerCase() as keyof typeof variables;
        const currentValue = variables[resourceKey];
        if (typeof currentValue === "number" && currentValue + product.value < 0) return false;
    }
    return true;
};

export const createEgdesForShape = (shape: BuildingTileType[][]): Edge[] => {
    const edges: Edge[] = [];

    if (shape.length === 0) {
        return edges;
    }

    const offsets: { dx: number; dy: number; side: Edge["side"] }[] = [
        { dx: 0, dy: -1, side: "top" },
        { dx: 1, dy: 0, side: "right" },
        { dx: 0, dy: 1, side: "bottom" },
        { dx: -1, dy: 0, side: "left" },
    ];

    for (let y = 0; y < shape.length; y++) {
        const row = shape[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x] === "Empty") {
                continue;
            }

            for (const { dx, dy, side } of offsets) {
                const neighborY = y + dy;
                const neighborX = x + dx;
                const neighborRow = shape[neighborY];
                const neighborTile = neighborRow ? neighborRow[neighborX] : undefined;

                if (!neighborTile || neighborTile === "Empty") {
                    edges.push({
                        position: { x, y },
                        side,
                        synergy: null,
                    });
                }
            }
        }
    }

    return edges;
};

export const rotateShape = (shape: BuildingTileType[][], rotation: number): BuildingTileType[][] => {
    if (shape.length === 0) {
        return [];
    }
    let currentShape = shape.map((row) => [...row]);

    const rotateClockwise = (matrix: BuildingTileType[][]): BuildingTileType[][] => {
        if (matrix.length === 0 || matrix[0].length === 0) {
            return [];
        }

        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated: BuildingTileType[][] = Array.from({ length: cols }, () => Array(rows) as BuildingTileType[]);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                rotated[x][rows - 1 - y] = matrix[y][x];
            }
        }

        return rotated;
    };

    for (let i = 0; i < rotation; i++) {
        currentShape = rotateClockwise(currentShape);
    }

    return currentShape;
};
