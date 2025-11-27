import { Application, useExtend } from "@pixi/react";
import { Container, FederatedPointerEvent, Graphics, Sprite, Rectangle as PixiRectangle } from "pixi.js";
import { useRef, useState } from "react";
import { Point } from "./Point";
import type { ConnectingPoint, CurvedLine, Line, Point as PointType, Rectangle } from "./types";

export function PointsAndLinesCanvas() {
    useExtend({ Container, Graphics, Sprite, Text });

    const canvasWidth = 1200;
    const canvasHeight = 720;

    const [points, setPoints] = useState<ConnectingPoint[]>([]);
    const [straightLines, setStraightLines] = useState<Line[]>([]);
    const [curvedLines, setCurvedLines] = useState<CurvedLine[]>([]);
    const [startPos, setStartPos] = useState<PointType | null>(null);
    const [selectionArea, setSelectionArea] = useState<Rectangle | null>(null);

    const isSelectingRef = useRef(false);

    const handleCanvasPointerDown = (e: FederatedPointerEvent) => {
        if (e.button === 1) {
            const { x, y } = e.getLocalPosition(e.currentTarget);

            isSelectingRef.current = true;
            setStartPos({ x, y });
            setSelectionArea({
                x: x,
                y: y,
                width: 1,
                height: 1
            });

            return;
        }

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

    function handleCanvasPointerUp() {
        if (isSelectingRef.current && selectionArea) {
            const pointsInArea = points.filter(p => {
                if ((p.position.x >= selectionArea?.x && p.position.x <= selectionArea?.x + selectionArea?.width)
                    && (p.position.y >= selectionArea?.y && p.position.y <= selectionArea?.y + selectionArea?.height)) {
                    return true;
                }
                return false;
            })

            if (pointsInArea.length > 0) {
                setPoints(prev => [
                    ...prev.map(p => ({ ...p, isSelected: pointsInArea.some(p2 => p2.id === p.id) }))
                ]);
            }

            isSelectingRef.current = false;
            setSelectionArea(null);
            setStartPos(null);
        }
    }


    function handleCanvasPointerMove(e: FederatedPointerEvent) {
        if (!isSelectingRef.current || !selectionArea || !startPos)
            return;

        const { x, y } = e.getLocalPosition(e.currentTarget);

        const width = x - startPos.x;
        const height = y - startPos.y;

        const rect = {
            x: width < 0 ? startPos.x + width : selectionArea.x,
            y: height < 0 ? startPos.y + height : selectionArea.y,
            width: Math.abs(width),
            height: Math.abs(height)
        };

        setSelectionArea(rect);
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

            if (!controlPoint && !endPoint)
                break;

            if (!endPoint) {
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
                id: crypto.randomUUID(),
                startPos: { x: startPoint.position.x, y: startPoint.position.y },
                controlPos: { x: cpX, y: cpY },
                endPos: { x: endPoint.position.x, y: endPoint.position.y }
            }

            newLines.push(newLine);
        };

        if (newLines.length > 0) {
            setPoints(prev => [
                ...prev.map(p => ({ ...p, isSelected: false }))
            ]);
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
                id: crypto.randomUUID(),
                startPos: { x: point.position.x, y: point.position.y },
                endPos: { x: nextPoint.position.x, y: nextPoint.position.y }
            }

            newLines.push(newLine);
        };

        if (newLines.length > 0) {
            setPoints(prev => [
                ...prev.map(p => ({ ...p, isSelected: false }))
            ]);
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
                    hitArea={new PixiRectangle(0, 0, canvasWidth, canvasHeight)}
                    onPointerDown={handleCanvasPointerDown}
                    onPointerUp={handleCanvasPointerUp}
                    onPointerMove={handleCanvasPointerMove}
                >
                </pixiContainer>
                {points.map(p => (
                    <Point
                        key={p.id}
                        x={p.position.x}
                        y={p.position.y}
                        size={p.size}
                        color={p.isSelected ? '#66ff66' : p.color}
                        eventMode='static'
                        onClick={() => handlePointClick(p)} />
                ))}
                {straightLines.map(sl => (
                    <pixiGraphics
                        key={sl.id}
                        draw={(g) => {
                            g.clear();
                            g.moveTo(sl.startPos.x, sl.startPos.y);
                            g.lineTo(sl.endPos.x, sl.endPos.y);
                            g.stroke({ color: '#a6a6a6', width: 2 });
                        }} />
                ))}
                {curvedLines.map(cl => (
                    <pixiGraphics
                        key={cl.id}
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
                {selectionArea &&
                    <pixiGraphics
                        draw={(g) => {
                            g.clear()
                                .rect(selectionArea.x, selectionArea.y, selectionArea.width, selectionArea.height)
                                .stroke({ color: '#a6a6a6', width: 2 });
                        }} />
                }
            </Application>
            <div className="mt-2">
                <p>Click on the canvas to create points.</p>
                <p>Use "Draw straight" or "Draw curve" to draw lines between points.</p>
                <p>Hold MMB to use selection rectangle.</p>
            </div>
        </div>
    );
}