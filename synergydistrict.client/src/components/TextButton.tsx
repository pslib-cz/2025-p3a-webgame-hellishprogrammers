import type { FC } from "react";

type TextButtonProps = {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
};

export const TextButton: FC<TextButtonProps> = ({ text, isActive }) => {
  return (
    <div>
        <a href="">{text}</a>
    </div>
  );
};

export default TextButton;
