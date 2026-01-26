import { useId, type FC } from "react";
import type { InputTypes } from "../../../types/Input";
import ShowInfo from "../../ShowInfo/ShowInfo";
import styles from "./InputValue.module.css";

type InputValueProps = {
    text: string;
    inputType: InputTypes;
    value?: string | number;
    onChange?: (value: string) => void;
    animationDelay?: boolean;
};

const InputValue: FC<InputValueProps> = ({ text, inputType, value, onChange, animationDelay }) => {
    const inputId = useId();

    const left = () => {
        return <label htmlFor={inputId}>{text}</label>;
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
