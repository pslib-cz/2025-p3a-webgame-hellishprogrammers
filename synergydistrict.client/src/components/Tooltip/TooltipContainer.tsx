import type { FC, ReactNode, CSSProperties } from "react";
import { useState, useRef, useEffect } from "react";

type TooltipContainerProps = {
    children: ReactNode; 
    content: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    style?: CSSProperties;
};

export const TooltipContainer: FC<TooltipContainerProps> = ({ children, content, position = "top",style }) => {
    const [visible, setVisible] = useState(false);
    const [adjustedPosition, setAdjustedPosition] = useState<CSSProperties>({});
    const tooltipRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible && tooltipRef.current && containerRef.current) {
            const tooltip = tooltipRef.current;
            const rect = tooltip.getBoundingClientRect();
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let adjustments: CSSProperties = {};
            
            if (rect.right > viewportWidth) {
                const overflow = rect.right - viewportWidth;
                adjustments.left = `calc(50% - ${overflow + 10}px)`;
            } else if (rect.left < 0) {
                adjustments.left = `calc(50% + ${Math.abs(rect.left) + 10}px)`;
            }

            if (rect.bottom > viewportHeight) {
                if (position === "bottom") {
                    adjustments = {
                        ...adjustments,
                        top: "auto",
                        bottom: "100%",
                        marginTop: "0",
                        marginBottom: ".5rem",
                    };
                } else {
                    const overflow = rect.bottom - viewportHeight;
                    adjustments.top = `calc(50% - ${overflow + 10}px)`;
                }
            } else if (rect.top < 0) {
                if (position === "top") {
                    adjustments = {
                        ...adjustments,
                        bottom: "auto",
                        top: "100%",
                        marginBottom: "0",
                        marginTop: ".5rem",
                    };
                } else {
                    adjustments.top = `calc(50% + ${Math.abs(rect.top) + 10}px)`;
                }
            }
            
            setAdjustedPosition(adjustments);
        } else if (!visible) {
            setAdjustedPosition({});
        }
    }, [visible, position]);

    const TooltipContainerStyle: CSSProperties = {
        position: "absolute",
        visibility: visible ? "visible" : "hidden",
        zIndex: 1000,
        pointerEvents: "none",
        ...getPositionStyles(position),
        ...adjustedPosition,
        ...style,
    };

    const containerStyle: CSSProperties = {
        position: "relative",
        display: "block",
        alignContent: "center"
    };

    return (
        <div 
            ref={containerRef}
            style={containerStyle}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            <div ref={tooltipRef} style={TooltipContainerStyle}>
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
                marginBottom: ".5rem",
            };
        case "bottom":
            return {
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: ".5rem",
            };
        case "left":
            return {
                right: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                marginRight: ".5rem",
            };
        case "right":
            return {
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                marginLeft: ".5rem",
            };
    }
}

export default TooltipContainer;
