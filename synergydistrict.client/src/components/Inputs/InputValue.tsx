import { useId, type FC } from "react";
import type { InputTypes } from "../../types/Input";
import ShowInfo from "../ShowInfo";
import BorderLayout from "../BorderLayout";

type InputValueProps = {
  text: string;
  inputType: InputTypes;
  value?: string | number;
  onChange?: (value: string) => void;
};

const InputValue: FC<InputValueProps> = ({ text, inputType, value, onChange }) => {
  const inputId = useId();

  const left = () => {
    return <label htmlFor={inputId}>{text}</label>;
  };

  const right = () => {
    return (
      <BorderLayout>
        <input
          id={inputId}
          type={inputType}
          placeholder={placeholder()}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </BorderLayout>
    );
  };

  const placeholder = () => {
    switch (inputType) {
      case "number":
        return "10_";
      case "text":
        return "Nate Higgers";
    }
  };

  return <ShowInfo left={left()} right={right()} />;
};

export default InputValue;
