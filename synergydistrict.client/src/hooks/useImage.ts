import { useState, useEffect } from "react";

export function useImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      setImage(img);
      setStatus("loaded");
    };

    const handleError = () => {
      setStatus("failed");
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return [image, status] as const;
}