import type { FC } from "react";
import IconButtonStyle from "../styles/IconButton.module.css"
type IconButtonProps = {
    isSelected: boolean,
    iconKey:string,
    OnClick:() => void,
};

export const IconButton:FC<IconButtonProps> = ({isSelected,iconKey,OnClick}) => {
    const handleOnClick = () =>{
        OnClick()
    }
    return(
        <button onClick={handleOnClick} className={isSelected? IconButtonStyle.selected:IconButtonStyle.default}>
            {iconKey}
        </button>
    )
}