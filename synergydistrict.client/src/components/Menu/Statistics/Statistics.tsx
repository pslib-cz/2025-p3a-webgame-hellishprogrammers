import { useStatistics } from "../../../hooks/providers/useStatistics";

const Statistics = () => {
    const { statistics } = useStatistics();
    return (
        <>
            <p>text</p>
            <p>{statistics.moneyMade}</p>
        </>
    );
};

export default Statistics;
