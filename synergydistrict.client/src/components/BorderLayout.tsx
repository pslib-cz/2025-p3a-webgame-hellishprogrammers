import { type FC, type PropsWithChildren } from "react";
import BorderLayoutStyle from "../styles/BorderLayoutStyle.module.css";

const BorderLayout:FC<PropsWithChildren> = ({children, ...rest}) => {
    return(
        <div className={BorderLayoutStyle.layout}>
            {children}
        </div>
    )
}
export default BorderLayout