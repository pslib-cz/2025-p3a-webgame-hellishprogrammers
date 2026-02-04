import { useState } from "react";
import ToggleButton from "../../components/Buttons/ToggleButton/ToggleButton";
import Statistics from "../../components/Menu/Statistics/Statistics";
import History from "../../components/Menu/History/History";
import styles from "../../styles/Menu.module.css";

type StatisticsPage = "Statistics" | "History";

const StatisticsMenu = () => {
    const [page, setPage] = useState<StatisticsPage>("Statistics");

    const toggleButtonOptions: StatisticsPage[] = ["Statistics", "History"];

    const renderPage = () => {
        switch (page) {
            case "History":
                return <History />;
            case "Statistics":
                return <Statistics />;
            default:
                return <p>Page not found</p>;
        }
    };

    return (
        <div className={styles.menuContent}>
            <ToggleButton
                options={toggleButtonOptions}
                selectedIndex={toggleButtonOptions.indexOf(page)}
                onChange={(index) => setPage(toggleButtonOptions[index])}
            />
            {renderPage()}
        </div>
    );
};

export default StatisticsMenu;
