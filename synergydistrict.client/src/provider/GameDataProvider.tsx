import { createContext, type ReactNode, useState, useEffect } from "react";
import type { BuildingType, BuildingSynergy } from "../types/Game/Buildings";
import { BuildingApi } from "../api/BuildingApi";

interface GameDataContextType {
    buildings: BuildingType[];
    synergies: BuildingSynergy[];
    loading: boolean;
    error: string | null;
}

const api = new BuildingApi();

export const GameDataContext = createContext<GameDataContextType | null>(null);

export function GameDataProvider({ children }: { children: ReactNode }) {
    const [buildings, setBuildings] = useState<BuildingType[]>([]);
    const [synergies, setSynergies] = useState<BuildingSynergy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        api.getGameData()
            .then((result) => {
                setBuildings(result.buildings);
                setSynergies(result.synergies);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <GameDataContext.Provider value={{ buildings, synergies, loading, error }}>{children}</GameDataContext.Provider>
    );
}
