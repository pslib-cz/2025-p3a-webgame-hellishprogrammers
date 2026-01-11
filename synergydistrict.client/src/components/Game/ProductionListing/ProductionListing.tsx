import type { FC, ReactElement } from "react";
import styles from "./ProductionListing.module.css";
import type { ValuesBoxProps } from "../ValuesBox/ValuesBox";

type ProductionListingProps = {
    title: string;
    children: ReactElement<ValuesBoxProps> | ReactElement<ValuesBoxProps>[];
};

export const ProductionListing: FC<ProductionListingProps> = ({ title, children }) => {
    return (
        <div className={`${styles.productionListingn} border`}>
            <div className={styles.title}>
                <p className={styles.titleContent}>{title}</p>
            </div>
            <div className={styles.productionBox}>
                {children}
            </div>
        </div>
    );
};
export default ProductionListing;
