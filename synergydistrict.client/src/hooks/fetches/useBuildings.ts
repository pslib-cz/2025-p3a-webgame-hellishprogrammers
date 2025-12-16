import { useEffect, useState } from "react";
import { BuildingApi } from "../../api/BuildingApi";
import type { BuildingPreview } from "../../types/Game/Buildings";

const api = new BuildingApi();

export function useBuildings() {
    const [data, setData] = useState<BuildingPreview[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        api.getAllBuildings()
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
