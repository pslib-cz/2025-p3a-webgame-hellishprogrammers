export type BuildingType = "Residential" | "Commercial" | "Industrial" | "Extractional" | "Recreational";
export type BuildingTileType = "Solid" | "Empty" | "Icon";
export type ResourceType = "Money" | "People" | "Energy" | "Happiness" | "Industry";

export type BuildingPreviewResponse = {
    buildingId: number;
    name: string;
    type: BuildingType;
    colorHex: string;
    iconKey: string;
    shape: BuildingTileType[][];
}

export type SynergyBuilding ={
    buildingId: number;
    name: string;
    type: BuildingType;
    colorHex: string;
}

export type BuildingSynergyResponse = {
    sourceBuildingId: SynergyBuilding;
    targetBuildingId: SynergyBuilding;
    productionBonuses: Production[];
}

export type Production = {
    resourceType: ResourceType;
    amount: number;
}

export type BuildingDetailResponse = {
    buildingId: number;
    name: string;
    type: string;
    description: string;
    colorHex: string;
    iconKey: string;
    cost: number;
    shape: BuildingTileType[][];
    baseProduction: Production;
    incomingSynergies: BuildingSynergyResponse[];
    outgoingSynergies: BuildingSynergyResponse[];
}

export class BuildingApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "/api/building") {
        this.baseUrl = baseUrl;
    }

    async getAllBuildings(): Promise<BuildingPreviewResponse[]> {
        const res = await fetch(this.baseUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch buildings. Status: ${res.status}`);
        }

        const data = (await res.json()) as BuildingPreviewResponse[];
        return data;
    }

    async getBuildingDetail(id: number): Promise<BuildingDetailResponse> {
        const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (res.status === 404) {
            throw new Error(`Building with id ${id} not found.`);
        }

        if (!res.ok) {
            const message = await res.text().catch(() => "");
            throw new Error(
                `Failed to fetch building detail. Status: ${res.status}. ${message}`
            );
        }

        const data = (await res.json()) as BuildingDetailResponse;
        return data;
    }
}