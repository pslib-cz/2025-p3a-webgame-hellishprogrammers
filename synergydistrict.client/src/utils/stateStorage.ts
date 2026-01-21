type StorageScope = "session" | "local";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getStorage = (scope: StorageScope): Storage | null => {
    if (typeof window === "undefined") {
        return null;
    }

    return scope === "local" ? window.localStorage : window.sessionStorage;
};

export const loadStoredState = <T>(key: string, fallback: T, scope: StorageScope = "session"): T => {
    const storage = getStorage(scope);
    if (!storage) {
        return fallback;
    }

    const rawValue = storage.getItem(key);
    if (!rawValue) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(rawValue) as unknown;
        if (isPlainObject(parsed) && isPlainObject(fallback)) {
            return { ...fallback, ...parsed } as T;
        }

        return parsed as T;
    } catch {
        return fallback;
    }
};

export const saveStoredState = (key: string, value: unknown, scope: StorageScope = "session"): void => {
    const storage = getStorage(scope);
    if (!storage) {
        return;
    }

    try {
        storage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore storage failures
    }
};
