import styles from "../styles/Menu.module.css";
import TextButton from "../components/TextButton";
import { Outlet } from "react-router-dom";
import buttonStyles from "../styles/TextButton.module.css";

const Menu = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.menuSide}>
        <div className={styles.menuContainer}>
          <h1>Synergy District_</h1>
          <nav>
            <menu className={`h2 ${buttonStyles.navContainer}`}>
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
        <Outlet />
      </div>
    </div>
  );
};

export default Menu;
