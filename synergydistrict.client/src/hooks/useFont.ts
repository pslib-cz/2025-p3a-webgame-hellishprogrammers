import { useEffect, useState } from "react";

const useFont = (font:string) => {
    const [ fontsLoaded, setFontsLoaded ] = useState<boolean>(false);
    useEffect(() => {
        let cancelled = false;

        const loadFonts = async () => {
            try {
                await document.fonts.load(font);
                await document.fonts.ready;
            } finally {
                if (!cancelled) setFontsLoaded(true);
            }
        };

        loadFonts();
        return () => {
            cancelled = true;
        };
    }, [])

    return fontsLoaded;
}

export default useFont;