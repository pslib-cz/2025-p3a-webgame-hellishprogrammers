import type { FC } from "react";
import styles from "../Game/ProductionListing/ProductionListing.module.css";

type TooltipProps = {
    title: string;
    description: string;
};

export const Tooltip: FC<TooltipProps> = ({ title, description }) => {
    return (
        <div className={`${styles.productionListing} border`}>
            <div className={styles.title}>
                <p className={styles.titleContent}>{title}</p>
            </div>
            <div className={styles.productionBox}>
                {description}
            </div>
        </div>
    );
};
export default Tooltip;
