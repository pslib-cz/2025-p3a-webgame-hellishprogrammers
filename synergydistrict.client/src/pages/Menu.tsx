import TextButton from "../components/TextButton";
import styles from "../styles/Menu.module.css";

const Menu = () => {
  return (
    <div className={styles.menuLeft}>
      <h1>Synergy District_</h1>
      <nav>
        <menu>
          <ul>
            <TextButton text="button1" />
          </ul>
        </menu>

        {/* <NavLink to="play">Play</NavLink>
        <NavLink to="leaderboard">Leaderboard</NavLink>
        <NavLink to="statistics">Statistics</NavLink>
        <NavLink to="settings">Settings</NavLink> */}
      </nav>
    </div>
  );
};

export default Menu;
