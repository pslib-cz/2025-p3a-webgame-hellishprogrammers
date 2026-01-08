import { useState, useEffect } from "react";


export interface UseImageBitmapResult {
    bitmap: ImageBitmap | null;
    loading: boolean;
    error: Error | null;
}

export function useImageBitmap(url: string | null): UseImageBitmapResult {
    const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!url) {
            setBitmap(null);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;
        let currentBitmap: ImageBitmap | null = null;

        setLoading(true);
        setError(null);

        (async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to load image: ${response.status}`);
                }

                const blob = await response.blob();
                const bitmap = await createImageBitmap(blob);

                if (!cancelled) {
                    currentBitmap = bitmap;
                    setBitmap(bitmap);
                } else {
                    bitmap.close();
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err as Error);
                    setBitmap(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
            currentBitmap?.close();
        };
    }, [url]);

    return { bitmap, loading, error };
}
