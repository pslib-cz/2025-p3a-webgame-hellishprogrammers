import type { FC, ReactNode, CSSProperties } from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type TooltipContainerProps = {
    children: ReactNode; 
    content: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    style?: CSSProperties;
};

export const TooltipContainer: FC<TooltipContainerProps> = ({ children, content, position = "top",style }) => {
    const [visible, setVisible] = useState(false);
    const [adjustedPosition, setAdjustedPosition] = useState<CSSProperties>({});
    const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible && containerRef.current) {
            setContainerRect(containerRef.current.getBoundingClientRect());
        }
    }, [visible]);

    useEffect(() => {
        if (visible && tooltipRef.current && containerRect) {
            const tooltip = tooltipRef.current;
            const rect = tooltip.getBoundingClientRect();
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let adjustments: CSSProperties = {};
            
            if (rect.right > viewportWidth) {
                const overflow = rect.right - viewportWidth;
                adjustments.left = `${containerRect.left + containerRect.width / 2 - overflow - 10}px`;
                adjustments.transform = "translateX(-50%)";
            } else if (rect.left < 0) {
                adjustments.left = `${containerRect.left + containerRect.width / 2 + Math.abs(rect.left) + 10}px`;
                adjustments.transform = "translateX(-50%)";
            }

            if (rect.bottom > viewportHeight) {
                if (position === "bottom") {
                    adjustments = {
                        ...adjustments,
                        top: "auto",
                        bottom: `${window.innerHeight - containerRect.top}px`,
                        marginTop: "0",
                        marginBottom: ".5rem",
                    };
                } else {
                    const overflow = rect.bottom - viewportHeight;
                    adjustments.bottom = `${window.innerHeight - containerRect.top - overflow - 10}px`;
                    adjustments.top = "auto";
                }
            } else if (rect.top < 0) {
                if (position === "top") {
                    adjustments = {
                        ...adjustments,
                        bottom: "auto",
                        top: `${containerRect.bottom}px`,
                        marginBottom: "0",
                        marginTop: ".5rem",
                    };
                } else {
                    adjustments.top = `${containerRect.top + containerRect.height / 2 + Math.abs(rect.top) + 10}px`;
                }
            }
            
            setAdjustedPosition(adjustments);
        } else if (!visible) {
            setAdjustedPosition({});
            setContainerRect(null);
        }
    }, [visible, position, containerRect]);

    const TooltipContainerStyle: CSSProperties = {
        position: "fixed",
        visibility: visible ? "visible" : "hidden",
        zIndex: 1000,
        pointerEvents: "none",
        maxWidth: "20rem",
        minWidth: "12rem",
        width: "max-content",
        ...getFixedPositionStyles(position, containerRect),
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
            {visible && createPortal(
                <div ref={tooltipRef} style={TooltipContainerStyle}>
                    {content}
                </div>,
                document.body
            )}
        </div>
    );
};

function getFixedPositionStyles(position: "top" | "bottom" | "left" | "right", containerRect: DOMRect | null): CSSProperties {
    if (!containerRect) return {};
    
    switch (position) {
        case "top":
            return {
                bottom: `${window.innerHeight - containerRect.top}px`,
                left: `${containerRect.left + containerRect.width / 2}px`,
                transform: "translateX(-50%)",
                marginBottom: ".5rem",
            };
        case "bottom":
            return {
                top: `${containerRect.bottom}px`,
                left: `${containerRect.left + containerRect.width / 2}px`,
                transform: "translateX(-50%)",
                marginTop: ".5rem",
            };
        case "left":
            return {
                right: `${window.innerWidth - containerRect.left}px`,
                top: `${containerRect.top + containerRect.height / 2}px`,
                transform: "translateY(-50%)",
                marginRight: ".5rem",
            };
        case "right":
            return {
                left: `${containerRect.right}px`,
                top: `${containerRect.top + containerRect.height / 2}px`,
                transform: "translateY(-50%)",
                marginLeft: ".5rem",
            };
    }
}

export default TooltipContainer;
