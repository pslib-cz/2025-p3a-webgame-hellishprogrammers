import { useId, type FC } from "react";
import type { InputTypes } from "../../types/Input";
import ShowInfo from "../ShowInfo";
import BorderLayout from "../BorderLayout";

type InputValueProps = {
  text: string;
  inputType: InputTypes;
};

const InputValue: FC<InputValueProps> = ({ text, inputType }) => {
  const inputId = useId();

  const left = () => {
    return <label htmlFor={inputId}>{text}</label>;
  };

  const right = () => {
    return (
      <BorderLayout>
        <input id={inputId} type={inputType} placeholder={placeholder()} />
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
