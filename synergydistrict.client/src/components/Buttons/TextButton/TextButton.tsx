import { type FC } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TextButton.module.css";
import ToggleableText from "../../ToggleableText";

type TextButtonProps = {
    text: string;
    linkTo?: string;
    onClick?: () => void;
    isActive?: boolean;
};

export const TextButton: FC<TextButtonProps> = ({ text, linkTo, onClick, isActive = false }) => {
    const renderContext = () => {
        if (!linkTo) {
            return (
                <button
                    onClick={onClick}
                    className={`${styles.link} ${styles.linkUppercase} ${isActive ? styles.linkActive : ""}`}
                >
                    <ToggleableText text={text} isActive={isActive} />
                </button>
            );
        } else {
            return (
                <NavLink
                    to={linkTo}
                    className={({ isActive }) =>
                        `${styles.link} ${styles.linkUppercase} ${isActive ? styles.linkActive : ""}`
                    }
                    onClick={onClick}
                >
                    {({ isActive }) => <ToggleableText text={text} isActive={isActive} />}
                </NavLink>
            );
        }
    };

    return renderContext();
};

export default TextButton;
