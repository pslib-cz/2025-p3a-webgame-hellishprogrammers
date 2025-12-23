import { type MapGeneratingOptions, type MapTile } from "../types/Game/Grid";

export const GetChunks = async (options: MapGeneratingOptions): Promise<Record<string, MapTile[]>> => {
        const res = await fetch("/api/map/generate", {
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
    };

