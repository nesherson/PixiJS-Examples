import type { EventMode, FederatedPointerEvent } from "pixi.js";
export interface PointProps {
    x: number;
    y: number;
    size: number;
    color: string;
    eventMode?: EventMode;
    onClick: (e: FederatedPointerEvent) => void;
}

export function Point({ x, y, size, color, eventMode, onClick }: PointProps) {
    return (<pixiGraphics
        x={x}
        y={y}
        eventMode={eventMode}
        onClick={onClick}
        draw={(g) => {
            g.clear()
                .setFillStyle({ color })
                .circle(0, 0, size)
                .fill();
        }} />);
}
