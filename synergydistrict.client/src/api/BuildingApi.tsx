import type { Building } from "../types/Game/Buildings";

export class BuildingApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "/api/building") {
        this.baseUrl = baseUrl;
    }

    async getBuildings(id: number): Promise<Building> {
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

        const data = (await res.json()) as Building;
        return data;
    }
}
