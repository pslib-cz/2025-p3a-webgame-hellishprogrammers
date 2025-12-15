import { MapApi } from "../api/MapApi";
import { useEffect, useState } from "react";
import type { MapGeneratingOptions, MapTile } from "../types/Grid";

const api = new MapApi();

export function useMap(options: MapGeneratingOptions) {
    const [data, setData] = useState<Record<string, MapTile[]> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const optionsKey = JSON.stringify(options);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        api.getMapTiles(options)
            .then((result) => {
                if (!cancelled) {
                    console.log(result);
                    setData(result);
                }
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setError(err.message);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [optionsKey]);

    return { data, loading, error };
}
