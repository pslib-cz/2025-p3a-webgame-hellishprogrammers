import styles from "/src/styles/Menu.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import TextButton from "../components/Buttons/TextButton/TextButton";
import { NavLink, Outlet } from "react-router-dom";
import { IconClose } from "../components/Icons";
import { useEffect, useRef } from "react";
import { useSettings } from "../hooks/providers/useSettings";

const Menu = () => {
    const { gameSettings } = useSettings();
    const menuMusicRef = useRef<HTMLAudioElement | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // Create menu music with 10 second delay between plays
        const playMenuMusic = () => {
            if (menuMusicRef.current && gameSettings.isMusic) {
                menuMusicRef.current.play().catch(err => console.log("Menu music play failed:", err));
            }
        };

        const handleSongEnd = () => {
            // Wait 10 seconds before playing again
            timeoutRef.current = setTimeout(playMenuMusic, 10000);
        };

        menuMusicRef.current = new Audio("/audio/menu_music.mp3");
        menuMusicRef.current.volume = 0.3;
        menuMusicRef.current.addEventListener("ended", handleSongEnd);

        if (gameSettings.isMusic) {
            menuMusicRef.current.play().catch(err => console.log("Menu music play failed:", err));
        }

        return () => {
            if (menuMusicRef.current) {
                menuMusicRef.current.removeEventListener("ended", handleSongEnd);
                menuMusicRef.current.pause();
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [gameSettings.isMusic]);

    return (
        <div className={styles.menu}>
            <div className={styles.menuSide}>
                <div className={`${styles.menuContainer} ${styles.menuNarrow}`}>
                    <NavLink to="/menu">
                        <h1 className={underscore.parent}>Synergy District</h1>
                    </NavLink>
                    <nav>
                        <menu className={`h2`}>
                            <li>
                                <TextButton text="play" linkTo="play" />
                            </li>
                            <li>
                                <TextButton text="leaderboard" linkTo="leaderboard" />
                            </li>
                            <li>
                                <TextButton text="statistics" linkTo="statistics" />
                            </li>
                            <li>
                                <TextButton text="settings" linkTo="settings" />
                            </li>
                        </menu>
                    </nav>
                </div>
            </div>
            <div className={styles.menuSide}>
                <div className={styles.closeButton}>
                    <NavLink to="/menu">
                        <IconClose />
                    </NavLink>
                </div>
                <div className={styles.menuContainer}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Menu;
