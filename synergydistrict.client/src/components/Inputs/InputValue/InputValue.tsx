import { useId, type FC } from "react";
import type { InputTypes } from "../../../types/Input";
import ShowInfo from "../../ShowInfo/ShowInfo";
import styles from "./InputValue.module.css";

type InputValueProps = {
    text: string;
    inputType: InputTypes;
    value?: string | number;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onEnter?: () => void;
    animationDelay?: boolean;
};

const InputValue: FC<InputValueProps> = ({ text, inputType, value, onChange, onBlur, onEnter, animationDelay }) => {
    const inputId = useId();

    const left = () => {
        return <label htmlFor={inputId}>{text}</label>;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onEnter?.();
        }
    };

    const right = () => {
        return (
            <div className={`${styles.inputValue} border`}>
                <input
                    id={inputId}
                    type={inputType}
                    placeholder={placeholder()}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onBlur={onBlur}
                    onKeyDown={handleKeyDown}
                />
            </div>
        );
    };

    const placeholder = () => {
        switch (inputType) {
            case "number":
                return "10_";
            case "text":
                return "placeholder";
        }
    };

    return <ShowInfo left={left()} right={right()} animationDelay={animationDelay} />;
};

export default InputValue;
