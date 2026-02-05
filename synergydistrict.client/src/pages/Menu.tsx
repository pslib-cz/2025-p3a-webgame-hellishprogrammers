import styles from "/src/styles/Menu.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import TextButton from "../components/Buttons/TextButton/TextButton";
import { NavLink, Outlet } from "react-router-dom";
import { IconClose } from "../components/Icons";
import { useSettings } from "../hooks/providers/useSettings";
import useMusic from "../hooks/useMusic";
import VersionDisplay from "../components/VersionDisplay/VersionDisplay";
import { useSound } from "../hooks/useSound";

const Menu = () => {
    const { gameSettings } = useSettings();
    const playClick = useSound("CLICK");

    useMusic({
        songsPath: ["/audio/menu_music.mp3"],
        volume: 0.2,
        timeBetweenSongs: 10000,
        isEnabled: gameSettings.isMusic,
        mode: "single",
    });

    return (
        <>
            <VersionDisplay />
            <div className={styles.menu}>
                <div className={styles.menuSide}>
                    <div className={`${styles.menuContainer} ${styles.menuNarrow}`}>
                        <NavLink to="/menu" onClick={() => playClick()}>
                            <h1 className={underscore.parent}>Synergy District</h1>
                        </NavLink>
                        <nav>
                            <menu className={`h2`}>
                                <li>
                                    <TextButton text="play" linkTo="play" />
                                </li>
                                <li>
                                    <TextButton text="tutorial" linkTo="tutorial" />
                                </li>
                                <li>
                                    <TextButton text="statistics" linkTo="statistics" />
                                </li>
                                <li>
                                    <TextButton text="settings" linkTo="settings" />
                                </li>
                                <li>
                                    <TextButton text="credits" linkTo="credits" />
                                </li>
                            </menu>
                        </nav>
                    </div>
                </div>
                <div className={styles.menuSide}>
                    <div className={styles.closeButton}>
                        <NavLink to="/menu" onClick={() => playClick()}>
                            <IconClose />
                        </NavLink>
                    </div>
                    <div className={styles.menuContainer}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menu;
