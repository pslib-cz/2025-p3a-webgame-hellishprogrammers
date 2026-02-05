import styles from "/src/styles/Menu.module.css";

const CreditsMenu = () => {

    return (
        <>
            <div className={styles.menuContent}>
                    <h2>
                        Created by:
                    </h2>
                    <div>
                        Daniel Brzezina, Matěj Kovář, Michajlo Odynec
                    </div>
                    <h2>
                        Music by:
                    </h2>
                    <div>
                        melodyayresgriffiths, moodmode, inono777, Maksym_Dudchyk
                    </div>
            </div>
        </>
    )
}

export default CreditsMenu;