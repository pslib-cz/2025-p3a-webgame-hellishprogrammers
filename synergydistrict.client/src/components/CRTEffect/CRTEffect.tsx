import './CRTEffect.css';

interface CRTEffectProps {
    intensity: number; // 0-100, 0 = off
}

export default function CRTEffect({ intensity }: CRTEffectProps) {
    if (intensity === 0) {
        return null;
    }

    // Normalize intensity to 0-1 range
    const normalizedIntensity = intensity / 100;

    return (
        <div 
            className="crt-effect" 
            style={{ 
                '--crt-intensity': normalizedIntensity,
                opacity: normalizedIntensity 
            } as React.CSSProperties & { '--crt-intensity': number }}
        >
            <div className="crt-scanlines"></div>
            <div className="crt-vignette"></div>
        </div>
    );
}
