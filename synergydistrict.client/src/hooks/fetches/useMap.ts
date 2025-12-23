import { GetChunks } from "../../api/MapApi";
import { useEffect, useState } from "react";
import type { MapGeneratingOptions, MapTile } from "../../types/Game/Grid";

export function useMap(options: MapGeneratingOptions) {
    const [data, setData] = useState<Record<string, MapTile[]> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const optionsKey = JSON.stringify(options);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        GetChunks(options)
            .then((result) => {
                if (!cancelled) {
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
