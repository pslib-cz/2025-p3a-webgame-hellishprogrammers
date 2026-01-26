import { type FC, type ReactElement } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TextButton.module.css";
import ToggleableText from "../../ToggleableText";

type TextButtonProps = {
    text: string;
    linkTo?: string;
    onClick?: () => void;
    isActive?: boolean;
    bacgroundColor?: string;
    children?: ReactElement;
};

export const TextButton: FC<TextButtonProps> = ({ text, linkTo, onClick, isActive = false, bacgroundColor, children }) => {
    const renderContext = () => {
        if (!linkTo) {
            return (
                <button
                    onClick={onClick}
                    className={`${styles.link} ${styles.linkUppercase} ${isActive ? styles.linkActive : ""} ${children ? styles.row : ""}`}
                    style={{ backgroundColor: `${isActive ? bacgroundColor : ""}` }}
                >
                    <ToggleableText text={text} isActive={isActive} />
                    {children}
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
