import { APP_VERSION } from "../../constants";
import styles from "./VersionDisplay.module.css";

const VersionDisplay = () => {
    return (
        <div className={styles.version}>
            v{APP_VERSION}
        </div>
    );
};

export default VersionDisplay;
