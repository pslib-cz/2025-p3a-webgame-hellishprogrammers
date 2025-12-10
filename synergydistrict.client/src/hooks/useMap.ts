import { MapApi } from "../api/MapApi";
import { useEffect, useState } from "react";
import type { MapTile } from "../types/Grid";

const api = new MapApi();

export function useMap(width: number, height: number) {
    const [data, setData] = useState<MapTile[][] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setLoading(true);
        api.getMapTiles(width, height)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
