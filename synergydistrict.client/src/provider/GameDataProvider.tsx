import { createContext, type ReactNode, useState, useEffect } from "react";
import type { BuildingType, BuildingSynergy } from "../types/Game/Buildings";
import { BuildingApi } from "../api/BuildingApi";
import { createEgdesForShape } from "../utils/PlacingUtils";

interface GameDataContextType {
    buildings: BuildingType[];
    synergies: BuildingSynergy[];
    naturalFeatures: { synergyItemId: number; name: string }[];
    loading: boolean;
    error: string | null;
}

const STORAGE_KEYS = {
    BUILDINGS: "buildings",
    SYNERGIES: "synergies",
    NATURAL_FEATURES: "naturalFeatures",
};

const loadFromStorage = <T,>(key: string): T | null => {
    try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

const api = new BuildingApi();

export const GameDataContext = createContext<GameDataContextType | null>(null);

export function GameDataProvider({ children }: { children: ReactNode }) {
    const [buildings, setBuildings] = useState<BuildingType[]>(() => {
        const stored = loadFromStorage<BuildingType[]>(STORAGE_KEYS.BUILDINGS);
        return stored ? stored.map((b) => ({ ...b, edges: b.edges || createEgdesForShape(b.shape) })) : [];
    });

    const [synergies, setSynergies] = useState<BuildingSynergy[]>(
        () => loadFromStorage<BuildingSynergy[]>(STORAGE_KEYS.SYNERGIES) || [],
    );

    const [naturalFeatures, setNaturalFeatures] = useState<{ synergyItemId: number; name: string }[]>(
        () => loadFromStorage<{ synergyItemId: number; name: string }[]>(STORAGE_KEYS.NATURAL_FEATURES) || [],
    );

    const [loading, setLoading] = useState(() => {
        const hasBuildings = !!sessionStorage.getItem(STORAGE_KEYS.BUILDINGS);
        const hasSynergies = !!sessionStorage.getItem(STORAGE_KEYS.SYNERGIES);
        const hasNaturalFeatures = !!sessionStorage.getItem(STORAGE_KEYS.NATURAL_FEATURES);
        return !hasBuildings || !hasSynergies || !hasNaturalFeatures;
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (loading) {
            api.getGameData()
                .then((result) => {
                    setBuildings(result.buildings.map((b) => ({ ...b, edges: createEgdesForShape(b.shape) })));
                    setSynergies(result.synergies);
                    setNaturalFeatures(result.naturalFeatures);
                    sessionStorage.setItem(STORAGE_KEYS.BUILDINGS, JSON.stringify(result.buildings));
                    sessionStorage.setItem(STORAGE_KEYS.SYNERGIES, JSON.stringify(result.synergies));
                    sessionStorage.setItem(STORAGE_KEYS.NATURAL_FEATURES, JSON.stringify(result.naturalFeatures));
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, []);

    return (
        <GameDataContext.Provider value={{ buildings, synergies, naturalFeatures, loading, error }}>{children}</GameDataContext.Provider>
    );
}
