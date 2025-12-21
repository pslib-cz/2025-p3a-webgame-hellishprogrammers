import styles from "../../styles/Menu.module.css";
import "../../styles/App.css";

const MainMenu = () => {
  return (
    <>
      <div className={styles.menuSide_lineless}>
        <img src="/images/menu.png" alt="Game" className="image--responsive" />
      </div>
    </>
  );
};

export default MainMenu;
