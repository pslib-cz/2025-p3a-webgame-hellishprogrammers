import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Splash.module.css";
import underscore from "../styles/FlashingUnderscore.module.css";
import { useSettings } from "../hooks/providers/useSettings";

const LOADING_DURATION = 8000; // 5 seconds

const Splash = () => {
    const navigate = useNavigate();
    const { gameSettings } = useSettings();
    const loadingAudioRef = useRef<HTMLAudioElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Create audio element
        loadingAudioRef.current = new Audio("/audio/loading.mp3");
        loadingAudioRef.current.volume = 0.8;

        return () => {
            if (loadingAudioRef.current) {
                loadingAudioRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        // Start loading audio on user interaction
        const handleInteraction = () => {
            if (isLoading) return; // Prevent multiple triggers
            
            setIsLoading(true);
            
            if (gameSettings.isMusic && loadingAudioRef.current) {
                loadingAudioRef.current.play().catch(err => console.log("Audio play failed:", err));
            }

            // Navigate after 5 seconds
            setTimeout(() => {
                navigate("/menu");
            }, LOADING_DURATION);
        };

        if (!isLoading) {
            window.addEventListener("keydown", handleInteraction);
            window.addEventListener("click", handleInteraction);
        }

        return () => {
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("click", handleInteraction);
        };
    }, [navigate, gameSettings.isMusic, isLoading]);

    return (
        <div className={styles.splash}>
            <div className={styles.content}>
                <h1 className={isLoading ? styles.loading : ""}>Synergy District</h1>
                {!isLoading && (
                    <p className={`${styles.prompt} ${underscore.parent}`}>
                        Press any key to continue
                    </p>
                )}
                {isLoading && (
                    <p className={styles.loadingText}>Loading</p>
                )}
            </div>
        </div>
    );
};

export default Splash;
