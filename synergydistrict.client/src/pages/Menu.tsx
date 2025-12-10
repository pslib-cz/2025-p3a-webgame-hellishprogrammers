import styles from "../styles/Menu.module.css";
import TextButton from "../components/TextButton";
import { Outlet } from "react-router-dom";

const Menu = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.menuSide}>
        <h1>Synergy District_</h1>
        <nav>
          <menu>
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
      <div className={styles.menuSide}>
        <Outlet />
      </div>
    </div>
  );
};

export default Menu;
