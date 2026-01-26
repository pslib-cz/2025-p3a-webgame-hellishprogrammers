import { useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Splash.module.css";
import underscore from "../styles/FlashingUnderscore.module.css";


const Splash = () => {
    const navigate = useNavigate();

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
