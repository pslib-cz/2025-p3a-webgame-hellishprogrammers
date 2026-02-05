import useGameProperties from "../../../hooks/providers/useGameProperties";
import { useHistory } from "../../../hooks/providers/useHistory";
import { useStatistics } from "../../../hooks/providers/useStatistics";
import { formatTime } from "../../../utils/timeUtils";
import ProductionListing from "../../Game/ProductionListing/ProductionListing";
import styles from "./Statistics.module.css";

const Statistics = () => {
    const { statistics } = useStatistics();
    const { history } = useHistory();
    const { TPS } = useGameProperties();

    let favoriteBuildingNames = "None";
    let maxCount = 0;
    const favorites: string[] = [];

    Object.entries(statistics.buildingsPlacedByType || {}).forEach(([name, count]) => {
        if (count > maxCount) {
            maxCount = count;
            favorites.length = 0;
            favorites.push(name);
        } else if (count === maxCount && count > 0) {
            favorites.push(name);
        }
    });

    if (favorites.length > 0) {
        favoriteBuildingNames = favorites.join(", ");
    }

    return (
        <>
            <h3>Overall</h3>
            <div className={styles.grid}>
                <ProductionListing title="Time spend playing">
                    <p className={styles.number}>{formatTime(statistics.timeSpendPlaying / TPS)}</p>
                </ProductionListing>
                <ProductionListing title="Best score">
                    <p className={styles.number}>{history.length == 0 ? "0" : Math.max(...history.map((h) => h.score))}</p>
                </ProductionListing>
                <ProductionListing title="Games played">
                    <p className={styles.number}>{history.length}</p>
                </ProductionListing>
            </div>
            <h3>Resources</h3>
            <div className={styles.grid}>
                <ProductionListing title="Money made">
                    <p className={styles.number}>{statistics.moneyMade}</p>
                </ProductionListing>
                <ProductionListing title="Money spend">
                    <p className={styles.number}>{statistics.moneySpend}</p>
                </ProductionListing>
            </div>
            <h3>Buildings</h3>
            <div className={styles.grid}>
                <ProductionListing title="Favorite Building">
                    <p className={styles.number}>{favoriteBuildingNames}</p>
                </ProductionListing>
                <ProductionListing title="Buildings Placed">
                    <p className={styles.number}>{statistics.buildingsPlaced}</p>
                </ProductionListing>
                <ProductionListing title="Buildings Demolished">
                    <p className={styles.number}>{statistics.buildingsDemolished}</p>
                </ProductionListing>
                <ProductionListing title="Buildings Upgraded">
                    <p className={styles.number}>{statistics.buildingsUpgraded}</p>
                </ProductionListing>
            </div>
        </>
    );
};

export default Statistics;
