export interface Point {
    x: number;
    y: number;
}

export interface ConnectingPoint {
    id: string;
    position: Point;
    isSelected: boolean;
    color: string;
    size: number
}

export interface Line {
    id: string;
    startPos: Point;
    endPos: Point;
}

export interface CurvedLine {
    id: string;
    startPos: Point;
    controlPos: Point;
    endPos: Point;
}

export interface Rectangle {
    x: number,
    y: number,
    width: number,
    height: number
}