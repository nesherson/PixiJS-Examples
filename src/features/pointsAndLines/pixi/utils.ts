import { Point } from 'pixi.js';
import type { RectangleNode } from './RectangleNode';

export function isInArea(area: RectangleNode, x: number, y: number) {
  if (
    x >= area.x &&
    x <= area.x + area.width &&
    y >= area.y &&
    y <= area.y + area.height
  ) {
    return true;
  }
  return false;
}

export function lerp(p1: Point, p2: Point, t: number): Point {
  return new Point(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
}
