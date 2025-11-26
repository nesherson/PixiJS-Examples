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
    startPos: Point;
    endPos: Point;
}

export interface CurvedLine {
    startPos: Point;
    controlPos: Point;
    endPos: Point;
}