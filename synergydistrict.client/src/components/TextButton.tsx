import { useState, type FC } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/TextButton.module.css";
import ButtonText from "./ButtonText";

type TextButtonProps = {
  text: string;
  linkTo?: string;
  onClick?: () => void;
  isActive?: boolean;
};

export const TextButton: FC<TextButtonProps> = ({ text, linkTo, onClick, isActive = false }) => {
  const [isTextActive, setIsTextActive] = useState<boolean>(false);

  const renderContext = () => {
    if (!linkTo) {
      return (
        <button onClick={onClick} className={`${styles.link} ${isActive ? styles.linkActive : ""}`}>
          <ButtonText text={text} isActive={isActive} />
        </button>
      );
    } else {
      return (
        <NavLink
          to={linkTo}
          className={({ isActive }) => {
            setIsTextActive(isActive);
            return `${styles.link} ${styles.linkUppercase} ${isActive ? styles.linkActive : ""}`;
          }}
          onClick={onClick}
        >
          <ButtonText text={text} isActive={isTextActive} />
        </NavLink>
      );
    }
  };

  return renderContext();
};

export default TextButton;
