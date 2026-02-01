import { type FC, type ReactElement, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TextButton.module.css";
import ToggleableText from "../../ToggleableText";
import { useSound, type SoundPath } from "../../../hooks/useSound";

type TextButtonProps = {
    text: string;
    linkTo?: string;
    onClick?: () => void;
    isActive?: boolean;
    bacgroundColor?: string;
    children?: ReactElement;
    textAlign?: "left" | "center" | "right";
    sound?: SoundPath;
};

export const TextButton: FC<TextButtonProps> = ({
    text,
    linkTo,
    onClick,
    isActive = false,
    bacgroundColor,
    children,
    textAlign = "center",
    sound = "CLICK",
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const playSound = useSound(sound);
    const playHover = useSound("HOVER");

    const renderContext = () => {
        if (!linkTo) {
            return (
                <button
                    onClick={() => {
                        playSound();
                        onClick?.();
                    }}
                    onMouseEnter={() => {
                        setIsHovered(true);
                        playHover();
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`${styles.link} ${styles.linkUppercase} ${isActive && !bacgroundColor ? styles.linkActive : ""} ${children ? styles.row : ""}`}
                    style={{
                        backgroundColor: `${(isActive || isHovered) && bacgroundColor ? `var(${bacgroundColor})` : ""}`,
                        color: `${(isActive || isHovered) && bacgroundColor ? `var(--text)` : ""}`,
                        textAlign: textAlign,
                    }}
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
                    onClick={() => {
                        playSound();
                        onClick?.();
                    }}
                    onMouseEnter={() => playHover()}
                >
                    {({ isActive }) => <ToggleableText text={text} isActive={isActive} />}
                </NavLink>
            );
        }
    };

    return renderContext();
};

export default TextButton;
