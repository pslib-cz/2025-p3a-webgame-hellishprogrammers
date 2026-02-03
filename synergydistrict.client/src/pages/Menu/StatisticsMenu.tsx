import { useState } from "react";
import ToggleButton from "../../components/Buttons/ToggleButton/ToggleButton";
import Statistics from "../../components/Menu/Statistics/Statistics";
import History from "../../components/Menu/History/History";

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
        <>
            <ToggleButton
                options={toggleButtonOptions}
                selectedIndex={toggleButtonOptions.indexOf(page)}
                onChange={(index) => setPage(toggleButtonOptions[index])}
            />
            {renderPage()}
        </>
    );
};

export default StatisticsMenu;
