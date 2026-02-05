import type { FC, ReactNode, CSSProperties } from "react";
import { useState } from "react";

type TooltipContainerProps = {
    children: ReactNode; 
    content: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    style?: CSSProperties;
};

export const TooltipContainer: FC<TooltipContainerProps> = ({ children, content, position = "top",style }) => {
    const [visible, setVisible] = useState(false);

    const TooltipContainerStyle: CSSProperties = {
        position: "absolute",
        visibility: visible ? "visible" : "hidden",
        zIndex: 1000,
        pointerEvents: "none",
        ...getPositionStyles(position),
        ...style,
    };

    const containerStyle: CSSProperties = {
        position: "relative",
        display: "inline-block",
    };

    return (
        <div 
            style={containerStyle}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            <div style={TooltipContainerStyle}>
                {content}
            </div>
        </div>
    );
};

function getPositionStyles(position: "top" | "bottom" | "left" | "right"): CSSProperties {
    switch (position) {
        case "top":
            return {
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginBottom: "8px",
            };
        case "bottom":
            return {
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "8px",
            };
        case "left":
            return {
                right: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                marginRight: "8px",
            };
        case "right":
            return {
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                marginLeft: "8px",
            };
    }
}

export default TooltipContainer;
