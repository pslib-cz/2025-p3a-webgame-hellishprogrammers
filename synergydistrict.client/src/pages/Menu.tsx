import styles from "/src/styles/Menu.module.css";
import underscore from "/src/styles/FlashingUnderscore.module.css";
import TextButton from "../components/TextButton";
import { NavLink, Outlet } from "react-router-dom";
import { IconClose } from "../components/Icons";

const Menu = () => {
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
        <NavLink to="/menu" className={styles.closeButton}>
          <IconClose />
        </NavLink>
        <div className={styles.menuContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Menu;
