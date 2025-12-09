import { useEffect, useState } from "react";
import { BuildingApi, type BuildingDetailResponse } from "../api/BuildingApi";

const api = new BuildingApi();

export function useBuildingDetail(id: number | null) {
  const [data, setData] = useState<BuildingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    api.getBuildingDetail(id)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}