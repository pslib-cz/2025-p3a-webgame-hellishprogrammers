import { type MapTile } from "../types/Grid";

export class MapApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "/api/map") {
        this.baseUrl = baseUrl;
    }

    async getMapTiles(): Promise<MapTile[][]> {
        const res = await fetch(this.baseUrl + "/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ width: 100, height: 100 })
        }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch map tiles. Status: ${res.status}`);
        }
        const data = (await res.json()) as MapTile[][];
        return data;
    }
}