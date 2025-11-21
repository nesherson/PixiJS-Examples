import { Application, useExtend } from "@pixi/react";
import { Container, FederatedPointerEvent, Graphics, Rectangle, Sprite, Texture, type EventMode } from "pixi.js";
import { useState } from "react";

interface Shape {
    x: number;
    y: number;
    size: number
}

interface Point {
    x: number;
    y: number;
}

interface Line {
    startPos: Point;
    endPos: Point;
}

export function TestCanvas() {
    useExtend({ Container, Graphics, Sprite, Text });
    const canvasWidth = 1200;
    const canvasHeight = 720;

    const [location, setLocation] = useState({ x: 0, y: 0 });
    const [points, setPoints] = useState<Shape[]>([]);
    const [connectingLines, setConnectingLines] = useState<Line[]>([]);
    const [line, setLine] = useState({
        startPos: { x: 0, y: 0 },
        endPos: { x: 0, y: 0 },
    });
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    const [pointSize, setPointSize] = useState(8);

    const handleCanvasClick = (e: FederatedPointerEvent) => {
        console.log('canvas');
        if (isDrawingLine) {
            setIsDrawingLine(false);

            return;
        }

        setLocation({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        setPoints(prev => [
            ...prev,
            { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, size: pointSize }
        ]);
    }

    function handleClearBtnClick() {
        setPoints([]);
        setConnectingLines([])
    }

    function handlePrintBtnClick() {
        if (!line) return;

        console.log(line.startPos);
    }

    function handlePointClick(e: FederatedPointerEvent) {
        console.log('point');

        const xPos = e.target.x + e.target.width / 2;
        const yPos = e.target.y + e.target.height / 2;

        if (isDrawingLine) {
            setConnectingLines(prev => [
                ...prev,
                {
                    startPos: { x: line?.startPos.x, y: line?.startPos.y },
                    endPos: { x: xPos, y: yPos }
                }
            ]);
            setIsDrawingLine(false);

            return;
        }

        setLine({
            startPos: { x: xPos, y: yPos },
            endPos: { x: xPos, y: yPos }
        });
        setIsDrawingLine(true);
    }

    function handleMouseMove(e: FederatedPointerEvent) {
        if (!isDrawingLine)
            return;

        setLine(prev => ({
            ...prev,
            endPos: { x: e.global.x, y: e.global.y }
        }));
    }

    return (
        <div>
            <div className="flex justify-even gap-2 mb-2">
                <p>Click location: {location.x}, {location.y}</p>
                <input
                    type="number"
                    value={pointSize}
                    onChange={(e) => setPointSize(parseInt(e.target.value))}
                    className="border border-zinc-400 rounded-xs px-2 py-1" />
                <button className="bg-blue-500 px-2 py-1 rounded-xs hover:bg-blue-400" onClick={handleClearBtnClick}>Clear</button>
                <button className="bg-blue-500 px-2 py-1 rounded-xs hover:bg-blue-400" onClick={handlePrintBtnClick}>Print</button>
            </div>
            <Application
                width={canvasWidth}
                height={canvasHeight}
                background='#ecf0f1'
                antialias>
                <pixiContainer
                    eventMode='static'
                    hitArea={new Rectangle(0, 0, canvasWidth, canvasHeight)}
                    onPointerDown={handleCanvasClick}
                    onPointerMove={handleMouseMove}>
                </pixiContainer>
                <pixiSprite
                    width={canvasWidth}
                    height={canvasHeight}
                    eventMode='static'
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    texture={Texture.EMPTY} />
                {points.map(s => (
                    <Point
                        key={crypto.randomUUID()}
                        x={s.x}
                        y={s.y}
                        size={s.size}
                        color='red'
                        eventMode='static'
                        onClick={handlePointClick} />
                ))}
                {connectingLines.map(l => (
                    <pixiGraphics
                        key={crypto.randomUUID()}
                        draw={(g) => {
                            g.clear();
                            g.moveTo(l.startPos.x, l.startPos.y);
                            g.lineTo(l.endPos.x, l.endPos.y);
                            g.stroke({ color: 'green', width: 2 });
                        }} />
                ))}
                {isDrawingLine && line.endPos &&
                    <pixiGraphics
                        draw={(g) => {
                            g.clear();
                            g.moveTo(line.startPos.x, line.startPos.y);
                            g.lineTo(line.endPos.x, line.endPos.y);
                            g.stroke({ color: 'green', width: 2 });
                        }} />}
                <pixiGraphics
                    draw={(g) => {
                        g.clear();
                        g.moveTo(50, 300);
                        g.quadraticCurveTo(150, 200, 250, 300);
                        g.stroke({ color: 'green', width: 2 });
                    }} />
            </Application>
        </div>
    );
}

interface PointProps {
    x: number;
    y: number;
    size: number;
    color: string;
    eventMode?: EventMode;
    onClick: (e: FederatedPointerEvent) => void;
}

function Point({ x, y, size, color, eventMode, onClick }: PointProps) {
    return (<pixiGraphics
        x={x}
        y={y}
        eventMode={eventMode}
        onClick={onClick}
        draw={(g) => {
            g.clear();
            g.setFillStyle({ color });
            g.rect(0, 0, size, size);
            g.fill();
        }} />);
}