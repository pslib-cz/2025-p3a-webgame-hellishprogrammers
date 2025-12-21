import { type FC, type PropsWithChildren } from "react";
import styles from "./BorderLayout.module.css";

const BorderLayout: FC<PropsWithChildren> = ({ children }) => {
    return <div className={styles.layout}>{children}</div>;
};
export default BorderLayout;
