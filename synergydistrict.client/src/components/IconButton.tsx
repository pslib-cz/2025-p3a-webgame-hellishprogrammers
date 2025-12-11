import type { FC } from "react";
import IconButtonStyle from "../styles/IconButton.module.css"
type IconButtonProps = {
    isSelected: boolean,
    iconKey:string,
    OnClick:() => void,
};

export const IconButton:FC<IconButtonProps> = ({isSelected,iconKey,OnClick}) => {
    const handleOnClick = () => {
        OnClick()
    }
    const styleSelector = () => {
        let trida: string = IconButtonStyle.default;
        if(isSelected){
            trida += " " + IconButtonStyle.selected
        }
        return trida;
    } 
    return(
        <button onClick={handleOnClick} className={styleSelector()}>
            {iconKey}
        </button>
    )
}