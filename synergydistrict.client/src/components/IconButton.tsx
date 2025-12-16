import type { FC } from "react";
import IconButtonStyle from "../styles/IconButton.module.css"
type IconButtonProps = {
    isSelected: boolean,
    iconKey:string,
    OnClick:() => void,
    amount?:React.ReactNode
};

export const IconButton:FC<IconButtonProps> = ({isSelected,iconKey,OnClick,amount}) => {
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
            <span className={IconButtonStyle.icon}>{iconKey}</span>
            {amount !== undefined && <span className={IconButtonStyle.amount}>{amount}</span>}
        </button>

    )
}