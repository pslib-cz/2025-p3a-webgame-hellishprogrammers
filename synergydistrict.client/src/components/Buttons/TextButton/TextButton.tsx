import { type FC, type ReactElement, useState } from "react";
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
    textAlign?: "left" | "center" | "right";
    disabled?: boolean;
};

export const TextButton: FC<TextButtonProps> = ({ text, linkTo, onClick, isActive = false, bacgroundColor, children, textAlign = "center", disabled = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const renderContext = () => {
        if (!linkTo) {
            return (
                <button
                    onClick={disabled ? undefined : onClick}
                    onMouseEnter={() => !disabled && setIsHovered(true)}
                    onMouseLeave={() => !disabled && setIsHovered(false)}
                    disabled={disabled}
                    className={`${styles.link} ${styles.linkUppercase} ${isActive && !bacgroundColor ? styles.linkActive : ""} ${children ? styles.row : ""} ${disabled ? styles.disabled : ""}`}
                    style={{backgroundColor:`${(isActive || isHovered) && bacgroundColor ? `var(${bacgroundColor})` : ""}`, color:`${(isActive || isHovered) && bacgroundColor ? `var(--text)` : ""}`, textAlign: textAlign}}
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
                        `${styles.link} ${styles.linkUppercase} ${isActive ? styles.linkActive : ""} ${disabled ? styles.disabled : ""}`
                    }
                    onClick={disabled ? undefined : onClick}
                >
                    {({ isActive }) => <ToggleableText text={text} isActive={isActive} />}
                </NavLink>
            );
        }
    };

    return renderContext();
};

export default TextButton;
