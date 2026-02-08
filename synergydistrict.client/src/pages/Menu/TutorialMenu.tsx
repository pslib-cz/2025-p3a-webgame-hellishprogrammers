import styles from "../../styles/Menu.module.css";

const TutorialMenu = () => {
    return (
        <div className={styles.menuContent}>
            <div>
                <h2>Basic Controls</h2>
                <p>
                    To move around the map, left-click and drag. You can zoom in and out using the scroll wheel. To
                    place a building, select one from the menu at the bottom of your screen. Once selected, right-click
                    to rotate the building and left-click to place it. Press escape to pause the game.
                </p>
            </div>
            <div>
                <h2>Game Loop</h2>
                <p>
                    Buildings cost money but produce statistics. You can view the statistics a building generates in the
                    sidebar on the left. Key metrics/statistics like money and population determine your final score,
                    while happiness acts as a score multiplier. To achieve the highest score possible, you must find the
                    ideal balance between the different types of buildings.
                </p>
            </div>
            <div>
                <h2>Synergies</h2>
                <p>
                    Buildings have synergies with each other and the map. When a building is selected, you can view
                    these synergies in the sidebar on the left. Synergies are applied through shared edges, the number
                    of edges a building shares determines the number of synergies it receives. Filtering Synergies At
                    the bottom of the left sidebar, you will see three icons:
                </p>
                <ul>
                    <li>Incoming Synergies: Shows the benefits the building is currently receiving.</li>
                    <li>Outgoing Synergies: Shows the benefits the building is providing to others.</li>
                    <li>
                        Preview Synergies: Shows the potential synergies you would gain by placing the building in the
                        hovered location.
                    </li>
                </ul>
            </div>
            <div>
                <h2>Upgrades</h2>
                <p>
                    When left clicked on a building on the map on the right a bar will show up. You can delete or
                    upgrade buildings there. You see what the next upgrade gives you.
                </p>
            </div>
        </div>
    );
};

export default TutorialMenu;
