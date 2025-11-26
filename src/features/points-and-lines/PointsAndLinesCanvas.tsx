import { Application, useExtend } from "@pixi/react";
import { Container, FederatedPointerEvent, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { useState } from "react";
import { Point } from "./Point";
import type { ConnectingPoint, CurvedLine, Line } from "./types";

export function PointsAndLinesCanvas() {
    useExtend({ Container, Graphics, Sprite, Text });
    const canvasWidth = 1200;
    const canvasHeight = 720;

    const [location, setLocation] = useState({ x: 0, y: 0 });
    const [points, setPoints] = useState<ConnectingPoint[]>([]);
    const [straightLines, setStraightLines] = useState<Line[]>([]);
    const [curvedLines, setCurvedLines] = useState<CurvedLine[]>([]);
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    
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
                size: 4,
                color: '#ff4d4d'
            }
        ]);
    }

    function handleClearBtnClick() {
        setPoints([]);
        setStraightLines([])
        setCurvedLines([]);
    }

    function handleSelectAllBtnClick() {
        setPoints(prev => [
            ...prev.map(p => ({ ...p, isSelected: true }))
        ]);
    }

    function handlePointClick(selectedPoint: ConnectingPoint) {
        selectedPoint.isSelected = !selectedPoint.isSelected;

        setPoints(prev => [
            ...prev.filter(p => p.id !== selectedPoint.id),
            selectedPoint
        ]);
    }

    function handleDrawCurve() {
        const selectedPoints = points.filter(p => p.isSelected);

        if (selectedPoints.length === 0)
            return;

        const newLines: CurvedLine[] = [];

        for (let i = 0; i < selectedPoints.length; i += 2) {
            const startPoint = selectedPoints[i];
            let controlPoint = selectedPoints[i + 1];
            let endPoint = selectedPoints[i + 2];

            if (controlPoint && !endPoint) {
                endPoint = controlPoint;

                const controlPointX = startPoint.position.x + (endPoint.position.x - startPoint.position.x) / 2 + 20;
                const controlPointY = startPoint.position.y + (endPoint.position.y - startPoint.position.y) / 2 + 20;

                controlPoint = {
                    ...startPoint,
                    position: {
                        x: controlPointX,
                        y: controlPointY
                    }
                }
            }

            const cpX = 2 * controlPoint.position.x - (startPoint.position.x + endPoint.position.x) / 2;
            const cpY = 2 * controlPoint.position.y - (startPoint.position.y + endPoint.position.y) / 2;

            const newLine = {
                startPos: { x: startPoint.position.x, y: startPoint.position.y },
                controlPos: { x: cpX, y: cpY },
                endPos: { x: endPoint.position.x, y: endPoint.position.y }
            }

            newLines.push(newLine);

        };

        if (newLines.length > 0) {
            setPoints(prev => {
                prev.forEach(p => p.isSelected = false);
                return [...prev];
            });
            setCurvedLines(prev => [
                ...prev,
                ...newLines
            ]);
        }
    }

    function handleDrawStraight() {
        const selectedPoints = points.filter(p => p.isSelected);

        if (selectedPoints.length === 0)
            return;

        const newLines: Line[] = [];

        for (let i = 0; i < selectedPoints.length; i++) {
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

        if (newLines.length > 0) {
            setPoints(prev => {
                prev.forEach(p => p.isSelected = false);
                return [...prev];
            });
            setStraightLines(prev => [
                ...prev,
                ...newLines
            ]);
        }
    }

    const isHandleDrawStraightBtnDisabled = points.filter(p => p.isSelected).length < 2;
    const isHandleDrawCurveBtnDisabled = points.filter(p => p.isSelected).length < 2;
    
    return (
        <div>
            <div className="flex justify-even gap-2 mb-2">
                <p>Click location: {location.x}, {location.y}</p>
                <button
                    className="bg-blue-400 px-2 py-1 rounded-xs hover:bg-blue-300 "
                    onClick={handleClearBtnClick}>Clear</button>
                <button
                    className="bg-blue-400 px-2 py-1 rounded-xs hover:bg-blue-300"
                    onClick={handleSelectAllBtnClick}>Select all</button>
                <button
                    className="bg-blue-400 px-2 py-1 rounded-xs hover:bg-blue-300 disabled:bg-zinc-200"
                    onClick={handleDrawStraight}
                    disabled={isHandleDrawStraightBtnDisabled}>Draw straight</button>
                <button
                    className="bg-blue-400 px-2 py-1 rounded-xs hover:bg-blue-300 disabled:bg-zinc-200"
                    onClick={handleDrawCurve}
                    disabled={isHandleDrawCurveBtnDisabled}>Draw curve</button>
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
                {straightLines.map(sl => (
                    <pixiGraphics
                        key={crypto.randomUUID()}
                        draw={(g) => {
                            g.clear();
                            g.moveTo(sl.startPos.x, sl.startPos.y);
                            g.lineTo(sl.endPos.x, sl.endPos.y);
                            g.stroke({ color: '#a6a6a6', width: 2 });
                        }} />
                ))}
                {curvedLines.map(cl => (
                    <pixiGraphics
                        key={crypto.randomUUID()}
                        draw={(g) => {
                            g.clear()
                                .moveTo(cl.startPos.x, cl.startPos.y)
                                .quadraticCurveTo(cl.controlPos.x,
                                    cl.controlPos.y,
                                    cl.endPos.x,
                                    cl.endPos.y, 3)
                                .stroke({ color: '#a6a6a6', width: 2 });
                        }} />
                ))}
            </Application>
        </div>
    );
}