import type { FC, ReactElement } from "react";
import styles from "../styles/ShowInfo.module.css";
import BorderLayout from "./BorderLayout";

type ShowInfoProps = {
  left: ReactElement;
  right: ReactElement;
};

const ShowInfo: FC<ShowInfoProps> = ({ left, right }) => {
  return (
    <>
      <div className={styles.showInfo}>
        <BorderLayout>
          <div className={styles.showInfo__left}>{left}</div>
        </BorderLayout>
        <div className={styles.showInfo__right}>{right}</div>
      </div>
    </>
  );
};

export default ShowInfo;
