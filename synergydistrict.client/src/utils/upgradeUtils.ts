import type { Production } from "../types/Game/Buildings";
import type { ActiveSynergies, MapBuilding, NaturalFeature } from "../types/Game/Grid";

export const getGroupedSynergies = (
    direction: "incoming" | "outgoing",
    currentBuildingId: string,
    allSynergies: ActiveSynergies[],
    allBuildings: MapBuilding[],
    allNaturalFeatures: NaturalFeature[],
) => {
    const relevantSynergies = allSynergies.filter((s) =>
        direction === "incoming" ? s.targetBuildingId === currentBuildingId : s.sourceBuildingId === currentBuildingId,
    );

    const groups = new Map<string, { count: number; productions: Production[] }>();

    relevantSynergies.forEach((syn) => {
        const otherId = direction === "incoming" ? syn.sourceBuildingId : syn.targetBuildingId;

        if (!groups.has(otherId)) {
            groups.set(otherId, { count: 0, productions: [] });
        }

        const group = groups.get(otherId)!;
        group.count += 1;

        syn.synergyProductions.forEach((prod) => {
            const existingProd = group.productions.find((p) => p.type === prod.type);
            if (existingProd) {
                existingProd.value += prod.value;
            } else {
                group.productions.push({ ...prod });
            }
        });
    });

    return Array.from(groups.entries())
        .map(([otherId, data]) => {
            const building = allBuildings.find((b) => b.MapBuildingId === otherId);
            const naturalFeature = allNaturalFeatures.find((nf) => nf.id === otherId);
            return {
                otherBuilding: building,
                naturalFeature: naturalFeature,
                count: data.count,
                productions: data.productions,
            };
        })
        .filter((item) => item.otherBuilding !== undefined || item.naturalFeature !== undefined) as {
        otherBuilding?: MapBuilding;
        naturalFeature?: NaturalFeature;
        count: number;
        productions: Production[];
    }[];
};

export const sumProduction = (production: Production[]): Production[] => {
    return production.reduce((acc, curr) => {
        const existing = acc.find((p) => p.type === curr.type);
        if (existing) {
            existing.value += curr.value;
        } else {
            acc.push({ ...curr });
        }
        return acc;
    }, [] as Production[]);
};
