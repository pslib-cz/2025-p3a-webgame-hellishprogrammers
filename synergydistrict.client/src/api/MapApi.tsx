import { type MapTile } from "../types/Grid";

export class MapApi {
    private readonly baseUrl: string;

    constructor(baseUrl: string = "/api/map") {
        this.baseUrl = baseUrl;
    }

    async getMapTiles(width:number, height:number): Promise<MapTile[][]> {
        const res = await fetch(this.baseUrl + "/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ width: width, height: height })
        }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch map tiles. Status: ${res.status}`);
        }
        const data = (await res.json()) as MapTile[][];
        return data;
    }
}