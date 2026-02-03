import { useContext } from "react";
import { StatisticsContext } from "../../provider/StatisticsProvider";

export const useStatistics = () => {
    const context = useContext(StatisticsContext);
    if (!context) throw new Error("useStatistics must be used within StatisticsProvider");
    return context;
};
