import type { BuildingDetail, BuildingPreview } from "../types/Game/Buildings";

export class BuildingApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "/api/building") {
        this.baseUrl = baseUrl;
    }

    async getAllBuildings(): Promise<BuildingPreview[]> {
        const res = await fetch(this.baseUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch buildings. Status: ${res.status}`);
        }

        const data = (await res.json()) as BuildingPreview[];
        return data;
    }

    async getBuildingDetail(id: number): Promise<BuildingDetail> {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (res.status === 404) {
            throw new Error(`Building with id ${id} not found.`);
        }

        if (!res.ok) {
            const message = await res.text().catch(() => "");
            throw new Error(`Failed to fetch building detail. Status: ${res.status}. ${message}`);
        }

        const data = (await res.json()) as BuildingDetail;
        return data;
    }
}
