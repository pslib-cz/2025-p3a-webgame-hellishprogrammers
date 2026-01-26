import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Splash.module.css";
import underscore from "../styles/FlashingUnderscore.module.css";
import { useSettings } from "../hooks/providers/useSettings";


const Splash = () => {
    const navigate = useNavigate();
    const { gameSettings } = useSettings();

    useEffect(() => {
        const handleKeyPress = () => {
            navigate("/menu");
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [navigate]);

    const handleClick = () => {
        navigate("/menu");
    };

    return (
        <div className={styles.splash} onClick={handleClick}>
            <div className={styles.content}>
                <h1>Synergy District</h1>
                    <p className={`${styles.prompt} ${underscore.parent}`}>
                        Press any key to continue
                    </p>
            </div>
        </div>
    );
};

export default Splash;
