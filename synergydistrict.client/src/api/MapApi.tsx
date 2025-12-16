import { type MapGeneratingOptions, type MapTile } from "../types/Game/Grid";

export class MapApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "/api/map") {
        this.baseUrl = baseUrl;
    }

    async getMapTiles(options: MapGeneratingOptions): Promise<Record<string, MapTile[]>> {
        const res = await fetch(this.baseUrl + "/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(options),
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch map tiles. Status: ${res.status}`);
        }
        const data = (await res.json()) as Record<string, MapTile[]>;
        return data;
    }
}
