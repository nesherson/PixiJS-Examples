import { Application, useExtend } from "@pixi/react";
import { Container, FederatedPointerEvent, Graphics, Rectangle, Sprite, Texture, type EventMode } from "pixi.js";
import { useState } from "react";

interface Point {
    x: number;
    y: number;
}

interface ConnectingPoint {
    id: string;
    position: Point;
    isSelected: boolean;
    color: string;
    size: number
}

interface Line {
    startPos: Point;
    endPos: Point;
}

interface CurvedLine {
    startPos: Point;
    controlPos: Point;
    endPos: Point;
}

export function PointsAndLinesCanvas() {
    useExtend({ Container, Graphics, Sprite, Text });
    const canvasWidth = 1200;
    const canvasHeight = 720;

    const [location, setLocation] = useState({ x: 0, y: 0 });
    const [points, setPoints] = useState<ConnectingPoint[]>([]);
    const [straightLines, setStraightLines] = useState<Line[]>([]);
    const [curvedLine, setCurvedLine] = useState<CurvedLine | null>(null);
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    const [pointSize, setPointSize] = useState(8);

    const handleCanvasClick = (e: FederatedPointerEvent) => {
        if (isDrawingLine) {
            setIsDrawingLine(false);

            return;
        }

        setLocation({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        setPoints(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                isSelected: false,
                position: {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                },
                size: pointSize,
                color: '#ff4d4d'
            }
        ]);
    }

    function handleClearBtnClick() {
        setPoints([]);
        setStraightLines([])
        setCurvedLine(null);
    }

    function handlePrintBtnClick() {
        // if (!line) return;

        // console.log(line.startPos);
    }

    function handlePointClick(selectedPoint: ConnectingPoint) {
        selectedPoint.isSelected = !selectedPoint.isSelected;

        setPoints(prev => [
            ...prev.filter(p => p.id !== selectedPoint.id),
            selectedPoint
        ]);
    }

    function handleDrawCurve() {
        // setCurvedLine({
        //     startPos: { x: selectedPoints[0].x, y: selectedPoints[0].y },
        //     controlPos: { x: selectedPoints[1].x, y: selectedPoints[1].y },
        //     endPos: { x: selectedPoints[2].x, y: selectedPoints[2].y },
        // });
    }

    function handleDrawStraight() {
        const selectedPoints = points.filter(p => p.isSelected);

        if (selectedPoints.length === 0)
            return;

        const newLines: Line[] = [];

        for (let i = 0; i < selectedPoints.length; i++) {

            console.log(selectedPoints[i + 1]);

            const point = selectedPoints[i];
            const nextPoint = selectedPoints[i + 1];

            if (!nextPoint)
                break;

            const newLine = {
                startPos: { x: point.position.x, y: point.position.y },
                endPos: { x: nextPoint.position.x, y: nextPoint.position.y }
            }

            newLines.push(newLine);

        };

        setStraightLines(newLines);
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
                <button
                    className="bg-blue-500 px-2 py-1 rounded-xs hover:bg-blue-400"
                    onClick={handleClearBtnClick}>Clear</button>
                <button
                    className="bg-blue-500 px-2 py-1 rounded-xs hover:bg-blue-400"
                    onClick={handlePrintBtnClick}>Print</button>
                <button
                    className="bg-blue-500 px-2 py-1 rounded-xs hover:bg-blue-400"
                    onClick={handleDrawStraight}
                    disabled={false}>Draw straight</button>
                <button
                    className="bg-blue-500 px-2 py-1 rounded-xs hover:bg-blue-400"
                    onClick={handleDrawCurve}
                    disabled={true}>Draw curve</button>
            </div>
            <Application
                width={canvasWidth}
                height={canvasHeight}
                background='#ecf0f1'
                antialias>
                <pixiContainer
                    eventMode='static'
                    hitArea={new Rectangle(0, 0, canvasWidth, canvasHeight)}
                    onPointerDown={handleCanvasClick}>
                </pixiContainer>
                <pixiSprite
                    width={canvasWidth}
                    height={canvasHeight}
                    eventMode='static'
                    onClick={handleCanvasClick}
                    texture={Texture.EMPTY} />
                {points.map(s => (
                    <Point
                        key={crypto.randomUUID()}
                        x={s.position.x}
                        y={s.position.y}
                        size={s.size}
                        color={s.isSelected ? '#66ff66' : s.color}
                        eventMode='static'
                        onClick={() => handlePointClick(s)} />
                ))}
                {straightLines.map(l => (
                    <pixiGraphics
                        key={crypto.randomUUID()}
                        draw={(g) => {
                            g.clear();
                            g.moveTo(l.startPos.x, l.startPos.y);
                            g.lineTo(l.endPos.x, l.endPos.y);
                            g.stroke({ color: '#a6a6a6', width: 2 });
                        }} />
                ))}
                {curvedLine &&
                    <pixiGraphics
                        draw={(g) => {
                            g.clear();
                            g.moveTo(curvedLine.startPos.x, curvedLine.startPos.y);
                            g.quadraticCurveTo(2 * curvedLine.controlPos.x - (curvedLine.startPos.x + curvedLine.endPos.x) / 2,
                                2 * curvedLine.controlPos.y - (curvedLine.startPos.y + curvedLine.endPos.y) / 2,
                                curvedLine.endPos.x,
                                curvedLine.endPos.y, 3);
                            g.stroke({ color: 'green', width: 2 });
                        }} />}
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