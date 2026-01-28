import type { FC, ReactElement, CSSProperties } from "react";
import styles from "./ProductionListing.module.css";
import type { ValuesBoxProps } from "../ValuesBox/ValuesBox";

type ProductionListingProps = {
    title: string;
    children: ReactElement<ValuesBoxProps> | ReactElement<ValuesBoxProps>[];
    style?: CSSProperties;
};

export const ProductionListing: FC<ProductionListingProps> = ({ title, children, style }) => {
    return (
        <div className={`${styles.productionListingn} border`} style={style}>
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
