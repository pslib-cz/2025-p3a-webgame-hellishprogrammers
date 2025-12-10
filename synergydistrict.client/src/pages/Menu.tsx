import styles from "../styles/Menu.module.css";
import TextButton from "../components/TextButton";
import { Outlet } from "react-router-dom";

const Menu = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.menuLeft}>
        <h1>Synergy District_</h1>
        <nav>
          <menu>
            <ul>
              <TextButton text="play" linkTo="play" />
              <TextButton text="leaderboard" linkTo="leaderboard" />
              <TextButton text="statistics" linkTo="statistics" />
              <TextButton text="settings" linkTo="settings" />
            </ul>
          </menu>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default Menu;
