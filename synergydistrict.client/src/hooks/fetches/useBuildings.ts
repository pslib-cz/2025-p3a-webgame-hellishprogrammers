import { useEffect, useState } from "react";
import { BuildingApi } from "../../api/BuildingApi";
import type { Building } from "../../types/Game/Buildings";

const api = new BuildingApi();

export function useBuildings() {
    const [data, setData] = useState<Building[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        api.getBuildings()
            .then((result) => setData(result))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
