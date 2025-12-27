import type { Building } from "../types/Game/Buildings";

export class BuildingApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "/api/building") {
        this.baseUrl = baseUrl;
    }

    async getBuildings(): Promise<Building[]> {
        const res = await fetch(`${this.baseUrl}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            const message = await res.text().catch(() => "");
            throw new Error(`Failed to fetch buildings. Status: ${res.status}. ${message}`);
        }

        const data = (await res.json()) as Building[];
        return data;
    }
}
