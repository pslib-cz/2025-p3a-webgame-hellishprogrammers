import type { MapBuilding } from "../types/Game/Grid";
import type { BuildingType, BuildingSynergy, Production } from "../types/Game/Buildings";

export function rotateBuildingShape(shape: BuildingType["shape"], rotation: number): BuildingType["shape"] {
    if (rotation === 0) return shape;

    let current = shape;
    for (let i = 0; i < rotation; i++) {
        current = rotateShapeClockwise(current);
    }
    return current;
}

function rotateShapeClockwise(shape: BuildingType["shape"]): BuildingType["shape"] {
    if (shape.length === 0) return shape;

    const height = Math.max(...shape.map((col) => col?.length ?? 0));
    const width = shape.length;
    const rotated: BuildingType["shape"] = [];

    for (let y = 0; y < height; y++) {
        const newColumn: (string | null)[] = [];
        for (let x = width - 1; x >= 0; x--) {
            const tile = shape[x]?.[y] ?? null;
            newColumn.push(tile);
        }
        rotated.push(newColumn as any);
    }

    return rotated;
}

export function getRotatedBuildingDimensions(shape: BuildingType["shape"], rotation: number) {
    const rotated = rotateBuildingShape(shape, rotation);
    const width = rotated.length;
    const height = Math.max(...rotated.map((col) => col?.length ?? 0));
    return { width, height };
}

export function detectSynergies(
    placedBuildings: MapBuilding[],
    allSynergies: BuildingSynergy[]
): Map<string, Production[]> {
    const synergyMap = new Map<string, Production[]>();

    // Build a map of building positions for quick lookup
    const buildingsByTile = new Map<string, MapBuilding>();

    for (const building of placedBuildings) {
        const shape = rotateBuildingShape(building.building.shape, building.rotation);

        for (let x = 0; x < shape.length; x++) {
            const column = shape[x];
            if (!column) continue;

            for (let y = 0; y < column.length; y++) {
                const tile = column[y];
                if (!tile || tile === "Empty") continue;

                const worldX = building.position.x + x;
                const worldY = building.position.y + y;
                const key = `${worldX},${worldY}`;
                buildingsByTile.set(key, building);
            }
        }
    }

    // Check synergies between adjacent buildings
    const processedPairs = new Set<string>();

    for (const building of placedBuildings) {
        const shape = rotateBuildingShape(building.building.shape, building.rotation);

        // Get all tiles this building occupies
        const buildingTiles = new Set<string>();
        for (let x = 0; x < shape.length; x++) {
            const column = shape[x];
            if (!column) continue;

            for (let y = 0; y < column.length; y++) {
                const tile = column[y];
                if (!tile || tile === "Empty") continue;

                const worldX = building.position.x + x;
                const worldY = building.position.y + y;
                buildingTiles.add(`${worldX},${worldY}`);
            }
        }

        // Check adjacent tiles (4-directional)
        const adjacentDirections = [
            { dx: 1, dy: 0 }, // right
            { dx: -1, dy: 0 }, // left
            { dx: 0, dy: 1 }, // down
            { dx: 0, dy: -1 }, // up
        ];

        for (const tile of buildingTiles) {
            const [x, y] = tile.split(",").map(Number);

            for (const { dx, dy } of adjacentDirections) {
                const adjX = x + dx;
                const adjY = y + dy;
                const adjKey = `${adjX},${adjY}`;

                const adjacentBuilding = buildingsByTile.get(adjKey);
                if (!adjacentBuilding) continue;

                // Check synergy from this building to the adjacent one
                const pairKey = `${building.buildingInstanceId}-${adjacentBuilding.buildingInstanceId}`;
                const reversePairKey = `${adjacentBuilding.buildingInstanceId}-${building.buildingInstanceId}`;

                if (processedPairs.has(pairKey) || processedPairs.has(reversePairKey)) continue;

                const synergy = allSynergies.find(
                    (s) =>
                        s.sourceBuildingId === building.building.buildingId &&
                        s.targetBuildingId === adjacentBuilding.building.buildingId
                );

                if (synergy) {
                    const synergyKey = `${building.buildingInstanceId}-${adjacentBuilding.buildingInstanceId}`;
                    if (!synergyMap.has(synergyKey)) {
                        synergyMap.set(synergyKey, []);
                    }
                    synergyMap.get(synergyKey)!.push(...synergy.synergyProduction);
                }

                processedPairs.add(pairKey);
            }
        }
    }

    return synergyMap;
}

export function calculateTotalProduction(placedBuildings: MapBuilding[], synergies: Map<string, Production[]>) {
    const totals = new Map<string, number>();

    // Base production from buildings
    for (const building of placedBuildings) {
        for (const prod of building.building.baseProduction) {
            const current = totals.get(prod.type) ?? 0;
            totals.set(prod.type, current + prod.value);
        }
    }

    // Synergy production
    for (const synergiesList of synergies.values()) {
        for (const prod of synergiesList) {
            const current = totals.get(prod.type) ?? 0;
            totals.set(prod.type, current + prod.value);
        }
    }

    return totals;
}
