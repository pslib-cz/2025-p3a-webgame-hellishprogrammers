import { useEffect, useState } from "react";
import { BuildingApi, type BuildingPreviewResponse } from "../api/BuildingApi";

const api = new BuildingApi();

export function useBuildings() {
  const [data, setData] = useState<BuildingPreviewResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getAllBuildings()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}